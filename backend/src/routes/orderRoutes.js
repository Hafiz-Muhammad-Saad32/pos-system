const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const orderController = require("../controllers/orderController");

const router = express.Router();

const listQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["pending", "preparing", "ready", "delivered", "cancelled"]).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sort: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
  customerId: z.string().optional(),
});

const idParamSchema = z.object({ id: z.string().min(1) });

const statusBodySchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "delivered", "cancelled"]),
});

router.get("/", requireAuth, validate({ query: listQuerySchema }), orderController.list);
router.get("/:id", requireAuth, validate({ params: idParamSchema }), orderController.getById);
router.patch(
  "/:id/status",
  requireAuth,
  validate({ params: idParamSchema, body: statusBodySchema }),
  orderController.updateStatus
);

module.exports = router;
