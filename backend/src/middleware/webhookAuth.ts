import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

// Checks x-webhook-secret header against WEBHOOK_SECRET env var
function requireWebhookSecret(req: Request, res: Response, next: NextFunction) {
  const secret = req.headers["x-webhook-secret"];
  if (!secret || secret !== process.env.WEBHOOK_SECRET) {
    return next(new ApiError(401, "Invalid or missing webhook secret."));
  }
  next();
}

export default requireWebhookSecret;
