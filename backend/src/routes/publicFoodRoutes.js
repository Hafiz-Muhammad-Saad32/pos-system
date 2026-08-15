const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const controller = require("../controllers/publicFoodController");

const router = express.Router();

const listQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  maxPrice: z.string().optional(),
  availableOnly: z.string().optional(),
  sort: z.enum(["recommended", "price-asc", "price-desc", "rating", "name"]).optional(),
  featured: z.string().optional(),
  popular: z.string().optional(),
});

const idParamSchema = z.object({ id: z.string().min(1) });

router.get("/", validate({ query: listQuerySchema }), controller.list);

router.get("/max-price", controller.maxPrice);

router.get("/:id", validate({ params: idParamSchema }), controller.getById);
router.get("/:id/related", validate({ params: idParamSchema }), controller.getRelated);

module.exports = router;
