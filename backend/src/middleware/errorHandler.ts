import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

// Central error handler: every error response is JSON { message }
// TODO: refine type — err can be ApiError, a Mongoose error, or an arbitrary thrown value
function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.isApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ message: `${field} already in use.` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const firstMsg = (Object.values(err.errors) as any[])[0]?.message || "Validation failed.";
    return res.status(400).json({ message: firstMsg });
  }

  // Mongoose bad ObjectId cast
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}.` });
  }

  console.error(err);
  return res.status(500).json({ message: "Internal server error." });
}

function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(new ApiError(404, "Route not found."));
}

export { errorHandler, notFoundHandler };
