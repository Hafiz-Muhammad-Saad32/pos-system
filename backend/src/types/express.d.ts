// Augments Express's Request type with the fields attached by our auth
// middleware. req.user comes from middleware/auth.js (staff/POS JWT),
// req.customer comes from middleware/customerAuth.js (customer cookie auth).
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
      customer?: {
        id: string;
      };
    }
  }
}

export {};
