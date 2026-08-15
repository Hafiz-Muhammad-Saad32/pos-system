const express = require("express");
const { z } = require("zod");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate");
const { requireCustomerAuth } = require("../middleware/customerAuth");
const asyncHandler = require("../utils/asyncHandler");
const controller = require("../controllers/customerAuthController");

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

router.post(
  "/login",
  authLimiter,
  validate({ body: loginSchema }),
  asyncHandler(controller.login)
);

router.post("/logout", asyncHandler(controller.logout));
router.get("/me", requireCustomerAuth, asyncHandler(controller.me));
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

module.exports = router;
