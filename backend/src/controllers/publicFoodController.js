const Food = require("../models/Food");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { serializePublicFood } = require("../utils/serializeFood");

const MAX_RESULTS = 100;

const SORT_MAP = {
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
  name: { name: 1 },
  // "recommended" (and anything else/unset): available first, then top rated
  recommended: { available: -1, rating: -1 },
};

// GET /api/foods (public)
const list = asyncHandler(async (req, res) => {
  const { search, category, maxPrice, availableOnly, sort, featured, popular } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }
  if (category) {
    filter.category = category;
  }
  if (maxPrice !== undefined) {
    const parsed = Number(maxPrice);
    if (!Number.isNaN(parsed)) {
      filter.price = { $lte: parsed };
    }
  }
  if (availableOnly === "true") {
    filter.available = true;
  }
  if (featured === "true") {
    filter.featured = true;
  }
  if (popular === "true") {
    filter.popular = true;
  }

  const sortSpec = SORT_MAP[sort] || SORT_MAP.recommended;

  const foods = await Food.find(filter).sort(sortSpec).limit(MAX_RESULTS);
  res.json({ foods: foods.map(serializePublicFood) });
});

// GET /api/foods/max-price (public) — must be registered before /:id in the router
const maxPrice = asyncHandler(async (req, res) => {
  const result = await Food.aggregate([
    { $match: { available: true } },
    { $group: { _id: null, max: { $max: "$price" } } },
  ]);
  res.json({ maxPrice: result[0]?.max || 0 });
});

// GET /api/foods/:id (public)
const getById = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }
  res.json({ food: serializePublicFood(food) });
});

// GET /api/foods/:id/related (public)
const getRelated = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }

  const related = await Food.find({ category: food.category, _id: { $ne: food._id } })
    .sort({ rating: -1 })
    .limit(8);

  res.json({ foods: related.map(serializePublicFood) });
});

module.exports = { list, maxPrice, getById, getRelated };
