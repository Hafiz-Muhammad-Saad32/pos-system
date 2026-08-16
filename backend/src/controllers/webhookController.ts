import mongoose from "mongoose";
import type { Request, Response } from "express";
import type { ClientSession } from "mongoose";
import Food from "../models/Food.js";
import Customer from "../models/Customer.js";
import Order, { type IOrder } from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildReceipt } from "../utils/receipt.js";
import { resolveAndValidateItems, decrementStock } from "../services/orderFulfillmentService.js";

// GET /api/webhook/foods - flat array of available foods with stock, for the AI to check
const listFoods = asyncHandler(async (req: Request, res: Response) => {
  const foods = await Food.find({ available: true }).sort({ name: 1 });
  res.json(foods);
});

// NOTE: resolveAndValidateItems/decrementStock used to live inline in this
// file. They've been extracted to services/orderFulfillmentService.js
// (unchanged logic) so the new customer order controller can reuse them
// instead of duplicating this validation.

interface CreateOrderBody {
  customerPhone: string;
  customerName: string;
  customerAddress?: string;
  items: { foodId: string; quantity: number }[];
  note?: string;
}

async function createOrderWithSession(
  body: CreateOrderBody,
  session: ClientSession | null
): Promise<IOrder> {
  const { customerPhone, customerName, customerAddress, items, note } = body;

  const resolvedItems = await resolveAndValidateItems(items, session);

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = 0;
  const total = subtotal - discount;

  // Find or create customer
  let customer = await Customer.findOne({ phone: customerPhone }).session(session ?? null);
  if (!customer) {
    customer = new Customer({
      name: customerName,
      phone: customerPhone,
      address: customerAddress || "",
    });
  } else {
    if (customerName) customer.name = customerName;
    if (customerAddress) customer.address = customerAddress;
  }

  // Decrement stock, flip availability at 0
  await decrementStock(resolvedItems, session);

  const [order] = await Order.create(
    [
      {
        customerId: customer._id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        items: resolvedItems.map((i) => ({
          foodId: i.foodId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        subtotal,
        discount,
        total,
        status: "pending",
        channel: "whatsapp",
        note: note || "",
      },
    ],
    { session }
  );

  customer.totalOrders += 1;
  customer.totalSpent += total;
  customer.lastOrderAt = new Date();
  await customer.save({ session });

  return order;
}

// POST /api/webhook/orders
const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const body: CreateOrderBody = req.body;

  let order: IOrder;
  let session: ClientSession | null;
  try {
    session = await mongoose.startSession();
  } catch (err) {
    session = null;
  }

  if (session) {
    try {
      await session.withTransaction(async () => {
        order = await createOrderWithSession(body, session);
      });
    } finally {
      session.endSession();
    }
  } else {
    // No replica set / transactions unavailable - validate before any writes,
    // then perform writes sequentially. See README for this limitation.
    await resolveAndValidateItems(body.items, null);
    order = await createOrderWithSession(body, null);
  }

  const receiptText = buildReceipt(order!);
  res.status(201).json({ order: order!, receiptText });
});

// GET /api/webhook/orders/:id
const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  res.json(order);
});

export { listFoods, createOrder, getOrder };
