import { Router } from "express";
import {
 getAds,
 solveAd
} from "../controllers/ads.controller.ts";
import { gameParamsSchema, solveAdsParamsSchema} from "../schemas/game.schema.ts";
import { validate } from "../middleware/validate.middleware.ts";

import { checkGameOver } from "../middleware/guard.middleware.ts";

const router = Router();
router.param("gameId", checkGameOver);

router.get("/:gameId/messages",  validate(gameParamsSchema, 'params'), getAds);
router.post("/:gameId/solve/:adId", validate(solveAdsParamsSchema, 'params'), solveAd);

export default router;
