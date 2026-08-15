// Favorites routes — brand new, mounted at /api/favorites. No existing route
// uses this prefix at all, so there's no collision or fallthrough needed.
const express = require("express");
const { z } = require("zod");
const validate = require("../middleware/validate");
const { requireCustomerAuth } = require("../middleware/customerAuth");
const controller = require("../controllers/favoriteController");

const router = express.Router();

const foodIdParamSchema = z.object({ foodId: z.string().min(1) });

router.use(requireCustomerAuth);

router.get("/", controller.list);
router.post("/:foodId", validate({ params: foodIdParamSchema }), controller.add);
router.delete("/:foodId", validate({ params: foodIdParamSchema }), controller.remove);

module.exports = router;
