const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const { login } = require("../controllers/authController");

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", validate({ body: loginSchema }), login);

module.exports = router;
