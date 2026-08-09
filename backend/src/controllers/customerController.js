const Customer = require("../models/Customer");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, paginate } = require("../utils/paginate");

const SORT_MAP = {
  name: { name: 1 },
  "-name": { name: -1 },
  totalSpent: { totalSpent: 1 },
  "-totalSpent": { totalSpent: -1 },
  totalOrders: { totalOrders: 1 },
  "-totalOrders": { totalOrders: -1 },
  lastOrderAt: { lastOrderAt: 1 },
  "-lastOrderAt": { lastOrderAt: -1 },
};

const list = asyncHandler(async (req, res) => {
  const { search, sort } = req.query;
  const { page, pageSize } = parsePagination(req.query);

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const sortSpec = SORT_MAP[sort] || { createdAt: -1 };
  const result = await paginate(Customer, filter, { page, pageSize, sort: sortSpec });
  res.json(result);
});

const getById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }
  const orders = await Order.find({ customerId: customer._id }).sort({ createdAt: -1 });
  res.json({ customer, orders });
});

module.exports = { list, getById };
