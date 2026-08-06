import { Router } from "express";
import {
 getShopItems,
 purchaseShopItem
} from "../controllers/shop.controller.ts";

const router = Router();

router.get("/:gameId", getShopItems);
router.post("/:gameId/buy/:itemId", purchaseShopItem);

export default router;
