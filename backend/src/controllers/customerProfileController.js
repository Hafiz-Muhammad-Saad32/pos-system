const Customer = require("../models/Customer");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { serializeCustomerUser } = require("../utils/serializeCustomer");

// PATCH /api/customers/me
// Only ever touches name/email/phone/address — never role, password, or
// email-verification/active-status fields, even if the client sends them.
const updateProfile = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer.id);
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }

  const { name, email, phone, address } = req.body;

  if (name !== undefined) customer.name = name;
  if (phone !== undefined) customer.phone = phone;

  if (email !== undefined) {
    const normalized = email.toLowerCase();
    if (normalized !== customer.email) {
      const taken = await Customer.findOne({ email: normalized, _id: { $ne: customer._id } });
      if (taken) {
        throw new ApiError(409, "An account with that email already exists.");
      }
      customer.email = normalized;
      customer.isEmailVerified = false;
    }
  }

  if (address !== undefined) {
    if (address.address !== undefined) customer.address = address.address;
    if (address.city !== undefined) customer.city = address.city;
    if (address.postalCode !== undefined) customer.postalCode = address.postalCode;
  }

  await customer.save();
  res.json({ user: serializeCustomerUser(customer) });
});

// PATCH /api/customers/me/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, nextPassword } = req.body;

  const customer = await Customer.findById(req.customer.id).select("+password");
  if (!customer) {
    throw new ApiError(401, "Not signed in.");
  }

  const match = await customer.comparePassword(currentPassword);
  if (!match) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  customer.password = nextPassword;
  await customer.save();

  res.json({ message: "Your password has been updated." });
});

module.exports = { updateProfile, changePassword };
