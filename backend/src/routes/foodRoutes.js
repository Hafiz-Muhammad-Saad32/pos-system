const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const foodController = require("../controllers/foodController");

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

module.exports = router;
