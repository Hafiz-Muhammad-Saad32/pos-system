import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import Food, { type IFood } from "../models/Food.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { serializePublicFood } from "../utils/serializeFood.js";

const MAX_RESULTS = 100;

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
  name: { name: 1 },
  // "recommended" (and anything else/unset): available first, then top rated
  recommended: { available: -1, rating: -1 },
};

// GET /api/foods (public)
const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, maxPrice, availableOnly, sort, featured, popular } = req.query;

  const filter: FilterQuery<IFood> = {};
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

  const sortSpec = SORT_MAP[sort as string] || SORT_MAP.recommended;

  const foods = await Food.find(filter).sort(sortSpec).limit(MAX_RESULTS);
  res.json({ foods: foods.map(serializePublicFood) });
});

// GET /api/foods/max-price (public) — must be registered before /:id in the router
const maxPrice = asyncHandler(async (req: Request, res: Response) => {
  const result = await Food.aggregate([
    { $match: { available: true } },
    { $group: { _id: null, max: { $max: "$price" } } },
  ]);
  res.json({ maxPrice: result[0]?.max || 0 });
});

// GET /api/foods/:id (public)
const getById = asyncHandler(async (req: Request, res: Response) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }
  res.json({ food: serializePublicFood(food) });
});

// GET /api/foods/:id/related (public)
const getRelated = asyncHandler(async (req: Request, res: Response) => {
  const food = await Food.findById(req.params.id);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }

  const related = await Food.find({ category: food.category, _id: { $ne: food._id } })
    .sort({ rating: -1 })
    .limit(8);

  res.json({ foods: related.map(serializePublicFood) });
});

export { list, maxPrice, getById, getRelated };
