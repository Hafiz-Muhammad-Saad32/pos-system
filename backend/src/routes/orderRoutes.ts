import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();

const listQuerySchema = z.object({
  search: z.string().optional(),
  status: z
    .enum(["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"])
    .optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
  customerId: z.string().optional(),
});

const idParamSchema = z.object({ id: z.string().min(1) });

const statusBodySchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "out_for_delivery", "delivered", "cancelled"]),
});

router.get("/", requireAuth, validate({ query: listQuerySchema }), orderController.list);
router.get("/:id", requireAuth, validate({ params: idParamSchema }), orderController.getById);
router.patch(
  "/:id/status",
  requireAuth,
  validate({ params: idParamSchema, body: statusBodySchema }),
  orderController.updateStatus
);

export default router;
