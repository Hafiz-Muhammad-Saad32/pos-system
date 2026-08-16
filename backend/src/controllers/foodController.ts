import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import Food, { type IFood } from "../models/Food.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { parsePagination, paginate } from "../utils/paginate.js";

const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, availability } = req.query;
  const { page, pageSize } = parsePagination(req.query);

  const filter: FilterQuery<IFood> = {};
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

const create = asyncHandler(async (req: Request, res: Response) => {
  const food = await Food.create(req.body);
  res.status(201).json(food);
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }
  res.json(food);
});

const remove = asyncHandler(async (req: Request, res: Response) => {
  const food = await Food.findByIdAndDelete(req.params.id);
  if (!food) {
    throw new ApiError(404, "Food not found.");
  }
  res.status(204).send();
});

export { list, create, update, remove };
