import { Router } from "express";
import {
  getShopItems,
  purchaseShopItem,
} from "../controllers/shop.controller.ts";

import {
  gameParamsSchema,
  purchaseItemParamsSchema,
} from "../schemas/game.schema.ts";
import { validate } from "../middleware/validate.middleware.ts";

import { checkGameOver } from "../middleware/guard.middleware.ts";

const router = Router();
router.param("gameId", checkGameOver);

router.get("/list/:gameId", validate(gameParamsSchema, "params"), getShopItems);
router.post(
  "/:gameId/buy/:itemId",
  validate(purchaseItemParamsSchema, "params"),
  purchaseShopItem,
);

export default router;
