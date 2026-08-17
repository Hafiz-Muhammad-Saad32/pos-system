import mongoose from "mongoose";
import type { Request, Response } from "express";
import type { ClientSession } from "mongoose";
import Order from "../models/Order.js";
import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { resolveAndValidateItems, decrementStock } from "../services/orderFulfillmentService.js";
import { generateOrderNumber } from "../utils/orderNumber.js";
import { serializeCustomerOrder } from "../utils/serializeOrder.js";

const DELIVERY_FEE = 3.9;
const FREE_DELIVERY_THRESHOLD = 45;

// GET /api/orders — current customer's own orders only
const list = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ customerId: req.customer!.id }).sort({ createdAt: -1 });
  res.json({ orders: orders.map(serializeCustomerOrder) });
});

// GET /api/orders/:id — must belong to the authenticated customer; 404 (not
// 403) if it doesn't, so we never confirm the order exists to someone else.
const getById = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, "Order not found.");
  }
  const order = await Order.findOne({ _id: req.params.id, customerId: req.customer!.id });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  res.json({ order: serializeCustomerOrder(order) });
});

const MAX_ORDER_NUMBER_ATTEMPTS = 3;

// POST /api/orders
const create = asyncHandler(async (req: Request, res: Response) => {
  const { items, customer: customerInput, deliveryAddress, paymentMethod, note } = req.body;

  const customer = await Customer.findById(req.customer!.id);
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }

  // Only foodId + quantity are trusted from the client; name/price/image (if
  // sent) are ignored and rebuilt from the live Food docs below.
  const requestedItems = items.map((item: any) => ({ foodId: item.foodId, quantity: item.quantity }));

  const attemptOnce = async (): Promise<any> => {
    let order: any;

    const run = async (activeSession: ClientSession | null) => {
      const resolvedItems = await resolveAndValidateItems(requestedItems, activeSession);

      const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const deliveryFee = subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
      const discount = 0;
      const total = subtotal + deliveryFee - discount;

      await decrementStock(resolvedItems, activeSession);

      const orderNumber = generateOrderNumber();

      const [created] = await Order.create(
        [
          {
            customerId: customer._id,
            // Existing flat fields — POS code (analyticsController.js,
            // customerController.js) reads these, so they're always populated.
            customerName: customerInput.name,
            customerPhone: customerInput.phone,
            customerAddress: deliveryAddress.address || "",
            items: resolvedItems.map((i) => ({
              foodId: i.foodId,
              name: i.name,
              quantity: i.quantity,
              price: i.price,
              image: i.food.image || i.food.imageUrl || "",
            })),
            subtotal,
            discount,
            total,
            status: "pending",
            channel: "website",
            note: note || "",
            orderNumber,
            deliveryFee,
            paymentMethod,
            paymentStatus: "unpaid",
            deliveryAddress: {
              address: deliveryAddress.address || "",
              city: deliveryAddress.city || "",
              postalCode: deliveryAddress.postalCode || "",
            },
            customerSnapshot: {
              name: customerInput.name,
              email: customerInput.email,
              phone: customerInput.phone,
            },
          },
        ],
        { session: activeSession }
      );

      // Atomic $inc instead of load-mutate-save: safe even if the
      // transaction driver internally retries this callback on a transient
      // error (load-mutate-save would double-count on such a retry since
      // the in-memory `customer` object stays mutated from the failed pass).
      await Customer.updateOne(
        { _id: customer._id },
        {
          $inc: { totalOrders: 1, totalSpent: total },
          $set: {
            lastOrderAt: new Date(),
            ...(deliveryAddress.address ? { address: deliveryAddress.address } : {}),
            ...(deliveryAddress.city ? { city: deliveryAddress.city } : {}),
            ...(deliveryAddress.postalCode ? { postalCode: deliveryAddress.postalCode } : {}),
          },
        },
        { session: activeSession || undefined }
      );

      order = created;
    };

    let session: ClientSession | null;
    try {
      session = await mongoose.startSession();
    } catch (err) {
      session = null;
    }

    if (session) {
      try {
        await session.withTransaction(async () => run(session));
      } finally {
        session.endSession();
      }
    } else {
      // No replica set / transactions unavailable — validate before any writes,
      // then write sequentially (same fallback the webhook uses).
      await resolveAndValidateItems(requestedItems, null);
      await run(null);
    }

    return order;
  };

  let order: any;
  let lastErr: any = null;

  for (let attempt = 0; attempt < MAX_ORDER_NUMBER_ATTEMPTS; attempt += 1) {
    try {
      order = await attemptOnce();
      lastErr = null;
      break;
    } catch (err: any) {
      // Only retry on an actual orderNumber collision (extremely unlikely
      // given the new generator, but the unique index is the real
      // guarantee, so we still honor it correctly). Any other error
      // (validation, stock, etc.) fails immediately, unchanged.
      const isOrderNumberConflict =
        err?.code === 11000 && err?.keyPattern && "orderNumber" in err.keyPattern;
      if (!isOrderNumberConflict) throw err;
      lastErr = err;
    }
  }
  if (lastErr) throw lastErr;

  res.status(201).json({ order: serializeCustomerOrder(order) });
});

// PATCH /api/orders/:id/cancel — only allowed while status is still "pending"
const cancel = asyncHandler(async (req: Request, res: Response) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, "Order not found.");
  }
  const order = await Order.findOne({ _id: req.params.id, customerId: req.customer!.id });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  if (order.status !== "pending") {
    throw new ApiError(409, `This order can no longer be cancelled (status: ${order.status}).`);
  }

  order.status = "cancelled";
  await order.save();

  res.json({ order: serializeCustomerOrder(order) });
});

export { list, getById, create, cancel };
