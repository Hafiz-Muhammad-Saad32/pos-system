import crypto from "crypto";
import type { Request, Response } from "express";
import Customer from "../models/Customer.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { serializeCustomerUser } from "../utils/serializeCustomer.js";
import {
  REFRESH_COOKIE,
  setAuthCookies,
  setAccessCookie,
  clearAuthCookies,
  verifyRefreshToken,
} from "../utils/customerTokens.js";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// POST /api/auth/register
const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone, address, city, postalCode } = req.body;
  const normalizedEmail = email.toLowerCase();

  const emailTaken = await Customer.findOne({ email: normalizedEmail });
  if (emailTaken) {
    throw new ApiError(409, "An account with that email already exists.");
  }

  // A Customer record may already exist for this phone number from a past
  // WhatsApp order (no password yet) — claim it instead of creating a
  // duplicate (phone is unique, so a naive create() would throw).
  let customer = await Customer.findOne({ phone });

  if (customer) {
    if (customer.password) {
      // Someone already registered an account on this phone number.
      throw new ApiError(409, "An account with that phone number already exists.");
    }
    customer.name = name;
    customer.email = normalizedEmail;
    customer.password = password;
    if (address) customer.address = address;
    if (city) customer.city = city;
    if (postalCode) customer.postalCode = postalCode;
  } else {
    customer = new Customer({
      name,
      phone,
      email: normalizedEmail,
      password,
      address: address || "",
      city: city || "",
      postalCode: postalCode || "",
    });
  }

  // role is never trusted from the client — Customer documents are always customers.
  await customer.save();

  setAuthCookies(res, customer._id);
  res.status(201).json({ user: serializeCustomerUser(customer) });
});

// POST /api/auth/login
// NOTE: this route is deliberately permissive about "not a match" cases —
// see customerAuthRoutes.js for why (falls through to staff login).
const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const customer = await Customer.findOne({ email: email.toLowerCase() }).select("+password");

  if (!customer || !customer.password) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  const match = await customer.comparePassword(password);
  if (!match) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  setAuthCookies(res, customer._id);
  res.json({ user: serializeCustomerUser(customer) });
});

// POST /api/auth/logout
const logout = asyncHandler(async (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.json({ message: "Signed out." });
});

// GET /api/auth/me
const me = asyncHandler(async (req: Request, res: Response) => {
  const customer = await Customer.findById(req.customer!.id);
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }
  res.json({ user: serializeCustomerUser(customer) });
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const customer = await Customer.findOne({ email: email.toLowerCase() });

  if (customer && customer.password) {
    const token = generateToken();
    customer.resetPasswordToken = token;
    customer.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
    await customer.save();

    // No email provider is configured yet (out of scope for this task) —
    // log the reset link so the flow is testable end-to-end locally.
    console.log(`[auth] password reset requested for ${customer.email}: token=${token}`);
  }

  // Never reveal whether the email exists.
  res.json({ message: "If an account exists for that email, a reset link has been sent." });
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  const customer = await Customer.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires");

  if (!customer) {
    throw new ApiError(400, "That reset link is invalid or has expired.");
  }

  customer.password = password;
  customer.resetPasswordToken = undefined;
  customer.resetPasswordExpires = undefined;
  await customer.save();

  res.json({ message: "Your password has been reset. You can now sign in." });
});

// POST /api/auth/verify-email
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  const customer = await Customer.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: new Date() },
  }).select("+verificationToken +verificationTokenExpires");

  if (!customer) {
    throw new ApiError(400, "That verification link is invalid or has expired.");
  }

  customer.isEmailVerified = true;
  customer.verificationToken = undefined;
  customer.verificationTokenExpires = undefined;
  await customer.save();

  res.json({ message: "Your email has been verified." });
});

// POST /api/auth/refresh — reads the refresh cookie only, never the access cookie.
const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) {
    throw new ApiError(401, "Not signed in.");
  }

  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(token) as { sub: string };
  } catch (err) {
    throw new ApiError(401, "Session expired. Please sign in again.");
  }

  const customer = await Customer.findById(payload.sub);
  if (!customer) {
    throw new ApiError(401, "Session expired. Please sign in again.");
  }

  setAccessCookie(res, customer._id);
  res.status(200).json({});
});

export {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refresh,
};
