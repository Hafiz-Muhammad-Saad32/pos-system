const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, paginate } = require("../utils/paginate");

const SORT_MAP = {
  createdAt: { createdAt: 1 },
  "-createdAt": { createdAt: -1 },
  total: { total: 1 },
  "-total": { total: -1 },
};

const list = asyncHandler(async (req, res) => {
  const { search, status, from, to, sort, customerId } = req.query;
  const { page, pageSize } = parsePagination(req.query);

  const filter = {};
  if (search) {
    filter.$or = [
      { customerName: { $regex: search, $options: "i" } },
      { customerPhone: { $regex: search, $options: "i" } },
    ];
  }
  if (status) {
    filter.status = status;
  }
  if (customerId) {
    filter.customerId = customerId;
  }
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  const sortSpec = SORT_MAP[sort] || { createdAt: -1 };
  const result = await paginate(Order, filter, { page, pageSize, sort: sortSpec });
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  res.json(order);
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  res.json(order);
});

module.exports = { list, getById, updateStatus };
