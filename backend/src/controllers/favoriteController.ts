import mongoose from "mongoose";
import type { Request, Response } from "express";
import type { Types } from "mongoose";
import Customer from "../models/Customer.js";
import Food from "../models/Food.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

function toIdStrings(favorites: Types.ObjectId[]): string[] {
  return favorites.map((id) => id.toString());
}

// GET /api/favorites
const list = asyncHandler(async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.customer!.id).select("favorites");
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }
  res.json({ favorites: toIdStrings(customer.favorites) });
});

// POST /api/favorites/:foodId (idempotent)
const add = asyncHandler(async (req: Request, res: Response) => {
  const { foodId } = req.params;
  if (!mongoose.isValidObjectId(foodId)) {
    throw new ApiError(404, "Food not found.");
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }

  const customer = await Customer.findById(req.customer!.id);
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
const remove = asyncHandler(async (req: Request, res: Response) => {
  const { foodId } = req.params;
  if (!mongoose.isValidObjectId(foodId)) {
    throw new ApiError(404, "Food not found.");
  }

  const food = await Food.findById(foodId);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }

  const customer = await Customer.findById(req.customer!.id);
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }

  customer.favorites = customer.favorites.filter((id) => id.toString() !== foodId);
  await customer.save();

  res.json({ favorites: toIdStrings(customer.favorites) });
});

export { list, add, remove };
