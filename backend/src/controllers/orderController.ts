import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import Order, { type IOrder } from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { parsePagination, paginate } from "../utils/paginate.js";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  createdAt: { createdAt: 1 },
  "-createdAt": { createdAt: -1 },
  total: { total: 1 },
  "-total": { total: -1 },
};

const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, status, from, to, sort, customerId } = req.query;
  const { page, pageSize } = parsePagination(req.query);

  const filter: FilterQuery<IOrder> = {};
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
    if (from) filter.createdAt.$gte = new Date(from as string);
    if (to) filter.createdAt.$lte = new Date(to as string);
  }

  const sortSpec = SORT_MAP[sort as string] || { createdAt: -1 };
  const result = await paginate(Order, filter, { page, pageSize, sort: sortSpec });
  res.json(result);
});

const getById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }
  res.json(order);
});

const updateStatus = asyncHandler(async (req: Request, res: Response) => {
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

export { list, getById, updateStatus };
