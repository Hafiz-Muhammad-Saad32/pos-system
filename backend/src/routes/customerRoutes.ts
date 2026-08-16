import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import * as customerController from "../controllers/customerController.js";

const router = express.Router();

const listQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sort: z.string().optional(),
});

const idParamSchema = z.object({ id: z.string().min(1) });

router.get("/", requireAuth, validate({ query: listQuerySchema }), customerController.list);
router.get(
  "/:id",
  requireAuth,
  validate({ params: idParamSchema }),
  customerController.getById
);

export default router;
