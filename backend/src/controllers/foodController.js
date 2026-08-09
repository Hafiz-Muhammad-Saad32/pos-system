const Food = require("../models/Food");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { parsePagination, paginate } = require("../utils/paginate");

const list = asyncHandler(async (req, res) => {
  const { search, category, availability } = req.query;
  const { page, pageSize } = parsePagination(req.query);

  const filter = {};
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }
  if (category) {
    filter.category = category;
  }
  if (availability === "available") {
    filter.available = true;
  } else if (availability === "unavailable") {
    filter.available = false;
  }

  const result = await paginate(Food, filter, { page, pageSize, sort: { name: 1 } });
  res.json(result);
});

const create = asyncHandler(async (req, res) => {
  const food = await Food.create(req.body);
  res.status(201).json(food);
});

const update = asyncHandler(async (req, res) => {
  const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }
  res.json(food);
});

const remove = asyncHandler(async (req, res) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }
  res.status(204).send();
});

module.exports = { list, create, update, remove };
