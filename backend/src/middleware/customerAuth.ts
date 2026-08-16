import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { ACCESS_COOKIE, verifyAccessToken } from "../utils/customerTokens.js";

// Verifies the customer access-token cookie, attaches { id } to req.customer.
// Completely independent from the staff requireAuth middleware (different
// cookie, different secret, never touches the Authorization header).
function requireCustomerAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) {
    return next(new ApiError(401, "Not signed in."));
  }
  try {
    const payload = verifyAccessToken(token) as { sub: string };
    req.customer = { id: payload.sub };
    next();
  } catch (err) {
    next(new ApiError(401, "Session expired. Please sign in again."));
  }
}

export { requireCustomerAuth };
