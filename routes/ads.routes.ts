import { Router } from "express";
import {
 getAds,
 solveAd
} from "../controllers/ads.controller.ts";

import { checkGameOver } from "../middleware/guard.middleware.ts";

const router = Router();
router.param("gameId", checkGameOver);

router.get("/:gameId/messages", getAds);
router.post("/:gameId/solve/:adId", solveAd);

export default router;
