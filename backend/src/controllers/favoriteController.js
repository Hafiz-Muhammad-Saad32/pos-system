const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Food = require("../models/Food");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function toIdStrings(favorites) {
  return favorites.map((id) => id.toString());
}

// GET /api/favorites
const list = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer.id).select("favorites");
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }
  res.json({ favorites: toIdStrings(customer.favorites) });
});

// POST /api/favorites/:foodId (idempotent)
const add = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  if (!mongoose.isValidObjectId(foodId)) {
    throw new ApiError(404, "Food not found.");
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }

  const customer = await Customer.findById(req.customer.id);
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }

  const already = customer.favorites.some((id) => id.toString() === foodId);
  if (!already) {
    customer.favorites.push(food._id);
    await customer.save();
  }

  res.json({ favorites: toIdStrings(customer.favorites) });
});

// DELETE /api/favorites/:foodId
const remove = asyncHandler(async (req, res) => {
  const { foodId } = req.params;
  if (!mongoose.isValidObjectId(foodId)) {
    throw new ApiError(404, "Food not found.");
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }

  const customer = await Customer.findById(req.customer.id);
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }

  customer.favorites = customer.favorites.filter((id) => id.toString() !== foodId);
  await customer.save();

  res.json({ favorites: toIdStrings(customer.favorites) });
});

module.exports = { list, add, remove };
