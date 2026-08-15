const mongoose = require("mongoose");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { resolveAndValidateItems, decrementStock } = require("../services/orderFulfillmentService");
const { generateOrderNumber } = require("../utils/orderNumber");
const { serializeCustomerOrder } = require("../utils/serializeOrder");

const DELIVERY_FEE = 3.9;
const FREE_DELIVERY_THRESHOLD = 45;

// GET /api/orders — current customer's own orders only
const list = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customerId: req.customer.id }).sort({ createdAt: -1 });
  res.json({ orders: orders.map(serializeCustomerOrder) });
});

// GET /api/orders/:id — must belong to the authenticated customer; 404 (not
// 403) if it doesn't, so we never confirm the order exists to someone else.
const getById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, "Order not found.");
  }
  const order = await Order.findOne({ _id: req.params.id, customerId: req.customer.id });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  res.json({ order: serializeCustomerOrder(order) });
});

// POST /api/orders
const create = asyncHandler(async (req, res) => {
  const { items, customer: customerInput, deliveryAddress, paymentMethod, note } = req.body;

  const customer = await Customer.findById(req.customer.id);
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }

  // Only foodId + quantity are trusted from the client; name/price/image (if
  // sent) are ignored and rebuilt from the live Food docs below.
  const requestedItems = items.map((item) => ({ foodId: item.foodId, quantity: item.quantity }));

  let order;
  let session;
  try {
    session = await mongoose.startSession();
  } catch (err) {
    session = null;
  }

  const run = async (activeSession) => {
    const resolvedItems = await resolveAndValidateItems(requestedItems, activeSession);

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? DELIVERY_FEE : 0;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    await decrementStock(resolvedItems, activeSession);

    const orderNumber = await generateOrderNumber();

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

    customer.totalOrders += 1;
    customer.totalSpent += total;
    customer.lastOrderAt = new Date();
    if (deliveryAddress.address) customer.address = deliveryAddress.address;
    if (deliveryAddress.city) customer.city = deliveryAddress.city;
    if (deliveryAddress.postalCode) customer.postalCode = deliveryAddress.postalCode;
    await customer.save({ session: activeSession });

    order = created;
  };

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

  res.status(201).json({ order: serializeCustomerOrder(order) });
});

// PATCH /api/orders/:id/cancel — only allowed while status is still "pending"
const cancel = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    throw new ApiError(404, "Order not found.");
  }
  const order = await Order.findOne({ _id: req.params.id, customerId: req.customer.id });
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

module.exports = { list, getById, create, cancel };
