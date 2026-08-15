// Customer profile routes — mounted at /api/customers, BEFORE the existing
// staff customerRoutes.js. No collision: the staff router only defines GET
// routes ("/" and "/:id"); these are both PATCH, so Express will never match
// them against the staff router's routes regardless of mount order.
const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const { requireCustomerAuth } = require("../middleware/customerAuth");
const controller = require("../controllers/customerProfileController");

const router = express.Router();

const addressSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  address: addressSchema.optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  nextPassword: z.string().min(8),
});

router.use(requireCustomerAuth);

router.patch("/me", validate({ body: updateProfileSchema }), controller.updateProfile);
router.patch("/me/password", validate({ body: changePasswordSchema }), controller.changePassword);

module.exports = router;
