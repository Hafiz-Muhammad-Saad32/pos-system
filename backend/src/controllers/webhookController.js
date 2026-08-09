const mongoose = require("mongoose");
const Food = require("../models/Food");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { buildReceipt } = require("../utils/receipt");

// GET /api/webhook/foods - flat array of available foods with stock, for the AI to check
const listFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({ available: true }).sort({ name: 1 });
  res.json(foods);
});

// Validates requested items against live Food docs.
// Throws ApiError(400, "<name> is out of stock") etc. Returns resolved item list.
async function resolveAndValidateItems(items, session) {
  const resolved = [];

  for (const reqItem of items) {
    const query = Food.findById(reqItem.foodId);
    if (session) query.session(session);
    const food = await query;

    if (!food) {
      throw new ApiError(400, `Item ${reqItem.foodId} was not found.`);
    }
    if (!food.available) {
      throw new ApiError(400, `${food.name} is not available.`);
    }
    if (typeof food.stock === "number" && food.stock < reqItem.quantity) {
      throw new ApiError(400, `${food.name} is out of stock.`);
    }

    resolved.push({
      food,
      foodId: food._id,
      name: food.name,
      quantity: reqItem.quantity,
      price: food.price,
    });
  }

  return resolved;
}

async function createOrderWithSession(body, session) {
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
  for (const item of resolvedItems) {
    if (typeof item.food.stock === "number") {
      item.food.stock -= item.quantity;
      if (item.food.stock <= 0) {
        item.food.stock = 0;
        item.food.available = false;
      }
      await item.food.save({ session });
    }
  }

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
const createOrder = asyncHandler(async (req, res) => {
  const body = req.body;

  let order;
  let session;
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

  const receiptText = buildReceipt(order);
  res.status(201).json({ order, receiptText });
});

// GET /api/webhook/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  res.json(order);
});

module.exports = { listFoods, createOrder, getOrder };
