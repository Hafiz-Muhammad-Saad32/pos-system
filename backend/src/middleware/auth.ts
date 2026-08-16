import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";

// Verifies Authorization: Bearer <token>, attaches { id, role } to req.user
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Missing or invalid authorization header."));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      sub: string;
      role: string;
    };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token."));
  }
}

// Must run after requireAuth
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError(403, "Admin access required."));
  }
  next();
}

export { requireAuth, requireAdmin };
