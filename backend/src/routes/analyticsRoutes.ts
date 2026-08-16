import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import * as analyticsController from "../controllers/analyticsController.js";

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

export default router;
