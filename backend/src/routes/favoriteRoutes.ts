// Favorites routes — brand new, mounted at /api/favorites. No existing route
// uses this prefix at all, so there's no collision or fallthrough needed.
import express from "express";
import { z } from "zod";
import validate from "../middleware/validate.js";
import { requireCustomerAuth } from "../middleware/customerAuth.js";
import * as controller from "../controllers/favoriteController.js";

const router = express.Router();

const foodIdParamSchema = z.object({ foodId: z.string().min(1) });

router.use(requireCustomerAuth);

router.get("/", controller.list);
router.post("/:foodId", validate({ params: foodIdParamSchema }), controller.add);
router.delete("/:foodId", validate({ params: foodIdParamSchema }), controller.remove);

export default router;
