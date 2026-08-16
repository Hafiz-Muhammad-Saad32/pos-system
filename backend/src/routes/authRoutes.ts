import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { login } from "../controllers/authController.js";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", validate({ body: loginSchema }), login);

export default router;
