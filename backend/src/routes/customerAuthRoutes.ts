import express from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import validate from "../middleware/validate.js";
import { requireCustomerAuth } from "../middleware/customerAuth.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as controller from "../controllers/customerAuthController.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

const addressSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const forgotPasswordSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({ token: z.string().min(1), password: z.string().min(8) });
const verifyEmailSchema = z.object({ token: z.string().min(1) });

router.post(
  "/register",
  authLimiter,
  validate({ body: registerSchema }),
  controller.register
);

// NOTE: controller.login/.logout/.me are already wrapped in asyncHandler at
// their source; re-wrapping here is redundant but harmless and preserved
// verbatim from the original JS. Cast to `any` to satisfy asyncHandler's
// param type (an unwrapped async fn) without altering runtime behavior.
router.post(
  "/login",
  authLimiter,
  validate({ body: loginSchema }),
  asyncHandler(controller.login as any)
);

router.post("/logout", asyncHandler(controller.logout as any));
router.get("/me", requireCustomerAuth, asyncHandler(controller.me as any));
router.post(
  "/forgot-password",
  authLimiter,
  validate({ body: forgotPasswordSchema }),
  controller.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  validate({ body: resetPasswordSchema }),
  controller.resetPassword
);
router.post("/verify-email", validate({ body: verifyEmailSchema }), controller.verifyEmail);
router.post("/refresh", controller.refresh);

export default router;
