const mongoose = require("mongoose");
const Order = require("../models/Order");
const Food = require("../models/Food");
const asyncHandler = require("../utils/asyncHandler");

function startOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d = new Date()) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

const NON_CANCELLED = { status: { $ne: "cancelled" } };

const stats = asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yestStart = startOfDay(yesterday);
  const yestEnd = endOfDay(yesterday);

  const [todayAgg, yestAgg, pendingOrders, availableFoods] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: todayStart, $lte: todayEnd }, ...NON_CANCELLED } },
      { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$total" } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: yestStart, $lte: yestEnd }, ...NON_CANCELLED } },
      { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$total" } } },
    ]),
    Order.countDocuments({ status: "pending" }),
    Food.countDocuments({ available: true }),
  ]);

  const todayOrders = todayAgg[0]?.count || 0;
  const todayRevenue = todayAgg[0]?.revenue || 0;
  const yestOrders = yestAgg[0]?.count || 0;
  const yestRevenue = yestAgg[0]?.revenue || 0;

  const pctDelta = (current, prev) => {
    if (prev === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - prev) / prev) * 1000) / 10;
  };

  res.json({
    todayOrders,
    todayRevenue,
    pendingOrders,
    availableFoods,
    ordersDelta: pctDelta(todayOrders, yestOrders),
    revenueDelta: pctDelta(todayRevenue, yestRevenue),
  });
});

function rangeConfig(range) {
  const now = new Date();
  if (range === "weekly") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7 * 8); // last 8 weeks
    return {
      start,
      dateFormat: "%G-W%V",
      labelFormat: (id) => id,
    };
  }
  if (range === "monthly") {
    const start = new Date(now);
    start.setMonth(start.getMonth() - 12); // last 12 months
    return {
      start,
      dateFormat: "%Y-%m",
      labelFormat: (id) => id,
    };
  }
  // daily default: last 14 days
  const start = new Date(now);
  start.setDate(start.getDate() - 14);
  return {
    start,
    dateFormat: "%Y-%m-%d",
    labelFormat: (id) => id,
  };
}

const sales = asyncHandler(async (req, res) => {
  const range = req.query.range || "daily";
  const { start, dateFormat, labelFormat } = rangeConfig(range);

  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: start }, ...NON_CANCELLED } },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(
    rows.map((r) => ({
      label: labelFormat(r._id),
      revenue: r.revenue,
      orders: r.orders,
    }))
  );
});

const popularFoods = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 50);

  const rows = await Order.aggregate([
    { $match: NON_CANCELLED },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.foodId",
        name: { $last: "$items.name" },
        unitsSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
      },
    },
    { $sort: { unitsSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "foods",
        localField: "_id",
        foreignField: "_id",
        as: "food",
      },
    },
    {
      $project: {
        _id: 0,
        foodId: "$_id",
        name: 1,
        unitsSold: 1,
        revenue: 1,
        category: { $arrayElemAt: ["$food.category", 0] },
      },
    },
  ]);

  res.json(rows);
});

const statusBreakdown = asyncHandler(async (req, res) => {
  const rows = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } },
    { $sort: { status: 1 } },
  ]);
  res.json(rows);
});

const unavailableFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({ available: false }).sort({ name: 1 });
  res.json(foods);
});

const summary = asyncHandler(async (req, res) => {
  const range = req.query.range || "daily";
  const { start, dateFormat, labelFormat } = rangeConfig(range);

  const [totals, series] = await Promise.all([
    Order.aggregate([
      { $match: { createdAt: { $gte: start }, ...NON_CANCELLED } },
      { $group: { _id: null, revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: start }, ...NON_CANCELLED } },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const revenue = totals[0]?.revenue || 0;
  const orders = totals[0]?.orders || 0;
  const avgOrderValue = orders > 0 ? Math.round((revenue / orders) * 100) / 100 : 0;

  res.json({
    revenue,
    orders,
    avgOrderValue,
    series: series.map((r) => ({
      label: labelFormat(r._id),
      revenue: r.revenue,
      orders: r.orders,
    })),
  });
});

module.exports = { stats, sales, popularFoods, statusBreakdown, unavailableFoods, summary };
