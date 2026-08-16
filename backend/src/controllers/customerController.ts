import type { Request, Response } from "express";
import type { FilterQuery } from "mongoose";
import Customer, { type ICustomer } from "../models/Customer.js";
import Order from "../models/Order.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { parsePagination, paginate } from "../utils/paginate.js";

const SORT_MAP: Record<string, Record<string, 1 | -1>> = {
  name: { name: 1 },
  "-name": { name: -1 },
  totalSpent: { totalSpent: 1 },
  "-totalSpent": { totalSpent: -1 },
  totalOrders: { totalOrders: 1 },
  "-totalOrders": { totalOrders: -1 },
  lastOrderAt: { lastOrderAt: 1 },
  "-lastOrderAt": { lastOrderAt: -1 },
};

const list = asyncHandler(async (req: Request, res: Response) => {
  const { search, sort } = req.query;
  const { page, pageSize } = parsePagination(req.query);

  const filter: FilterQuery<ICustomer> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const sortSpec = SORT_MAP[sort as string] || { createdAt: -1 };
  const result = await paginate(Customer, filter, { page, pageSize, sort: sortSpec });
  res.json(result);
});

const getById = asyncHandler(async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    throw new ApiError(404, "Customer not found.");
  }
  const orders = await Order.find({ customerId: customer._id }).sort({ createdAt: -1 });
  res.json({ customer, orders });
});

export { list, getById };
