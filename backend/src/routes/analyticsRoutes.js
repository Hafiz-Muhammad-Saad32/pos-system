const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const analyticsController = require("../controllers/analyticsController");

const router = express.Router();

const rangeQuerySchema = z.object({
  range: z.enum(["daily", "weekly", "monthly"]).optional(),
});

const limitQuerySchema = z.object({
  limit: z.string().optional(),
});

router.get("/stats", requireAuth, analyticsController.stats);
router.get("/sales", requireAuth, validate({ query: rangeQuerySchema }), analyticsController.sales);
router.get(
  "/popular-foods",
  requireAuth,
  validate({ query: limitQuerySchema }),
  analyticsController.popularFoods
);
router.get("/status-breakdown", requireAuth, analyticsController.statusBreakdown);
router.get("/unavailable-foods", requireAuth, analyticsController.unavailableFoods);
router.get(
  "/summary",
  requireAuth,
  validate({ query: rangeQuerySchema }),
  analyticsController.summary
);

module.exports = router;
