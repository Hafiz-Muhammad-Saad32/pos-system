const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const customerController = require("../controllers/customerController");

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

module.exports = router;
