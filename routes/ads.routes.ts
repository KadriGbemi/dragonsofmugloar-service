import { Router } from "express";
import {
 getAds,
 solveAd
} from "../controllers/ads.controller.ts";

const router = Router();

router.get("/:gameId/messages", getAds);
router.post("/:gameId/solve/:adId", solveAd);

export default router;
