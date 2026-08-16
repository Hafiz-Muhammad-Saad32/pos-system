import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import * as foodController from "../controllers/foodController.js";

const router = express.Router();

const listQuerySchema = z.object({
  search: z.string().optional(),
  category: z.enum(["Starters", "Mains", "Grill", "Desserts", "Beverages"]).optional(),
  availability: z.enum(["available", "unavailable"]).optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
});

const foodBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["Starters", "Mains", "Grill", "Desserts", "Beverages"]),
  price: z.number().nonnegative(),
  imageUrl: z.string().optional(),
  available: z.boolean().optional(),
  stock: z.number().nullable().optional(),
});

const foodUpdateSchema = foodBodySchema.partial();

const idParamSchema = z.object({ id: z.string().min(1) });

router.get("/", requireAuth, validate({ query: listQuerySchema }), foodController.list);

router.post(
  "/",
  requireAuth,
  requireAdmin,
  validate({ body: foodBodySchema }),
  foodController.create
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  validate({ params: idParamSchema, body: foodUpdateSchema }),
  foodController.update
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  validate({ params: idParamSchema }),
  foodController.remove
);

export default router;
