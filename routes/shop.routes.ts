import { Router } from "express";
import {
 getShopItems,
 purchaseShopItem
} from "../controllers/shop.controller.ts";

import { checkGameOver } from "../middleware/guard.middleware.ts";

const router = Router();
router.param("gameId", checkGameOver);

router.get("/list/:gameId", getShopItems);
router.post("/:gameId/buy/:itemId", purchaseShopItem);

export default router;
