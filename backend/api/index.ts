import "dotenv/config";
import mongoose from "mongoose";
import type { Request, Response } from "express";
import app from "../src/app.js";
import { connectDB } from "../src/config/db.js";

export default async (req: Request, res: Response) => {
  if (mongoose.connection.readyState === 0) {
    await connectDB(process.env.MONGO_URI as string);
  }
  return app(req, res);
};
