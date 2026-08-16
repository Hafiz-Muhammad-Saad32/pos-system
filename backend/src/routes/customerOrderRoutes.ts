import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { requireCustomerAuth } from "../middleware/customerAuth.js";
import * as controller from "../controllers/customerOrderController.js";

const router = express.Router();

const idParamSchema = z.object({ id: z.string().min(1) });

const addressSchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        foodId: z.string().min(1),
        quantity: z.number().int().positive(),
        // name/price/image may be sent for cart display but are ignored server-side
        name: z.string().optional(),
        price: z.number().optional(),
        image: z.string().optional(),
      })
    )
    .min(1),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
  }),
  deliveryAddress: addressSchema,
  paymentMethod: z.enum(["cash", "card", "online"]),
  note: z.string().optional(),
});

router.get("/", requireCustomerAuth, controller.list);
router.get("/:id", requireCustomerAuth, validate({ params: idParamSchema }), controller.getById);

router.post(
  "/",
  requireCustomerAuth,
  validate({ body: createOrderSchema }),
  controller.create
);
router.patch(
  "/:id/cancel",
  requireCustomerAuth,
  validate({ params: idParamSchema }),
  controller.cancel
);

export default router;
