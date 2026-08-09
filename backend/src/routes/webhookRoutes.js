const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const requireWebhookSecret = require("../middleware/webhookAuth");
const webhookController = require("../controllers/webhookController");

const router = express.Router();

const createOrderSchema = z.object({
  customerPhone: z.string().min(1),
  customerName: z.string().min(1),
  customerAddress: z.string().optional(),
  items: z
    .array(
      z.object({
        foodId: z.string().min(1),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  note: z.string().optional(),
});

const idParamSchema = z.object({ id: z.string().min(1) });

router.use(requireWebhookSecret);

router.get("/foods", webhookController.listFoods);
router.post("/orders", validate({ body: createOrderSchema }), webhookController.createOrder);
router.get("/orders/:id", validate({ params: idParamSchema }), webhookController.getOrder);

module.exports = router;
