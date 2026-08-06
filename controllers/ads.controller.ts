import { type NextFunction, type Request, type Response } from "express";
import type { SolveAdRequestParams } from "../types/ads.types.ts";
import type { GameIdRequestParams } from "../types/index.types.ts";

import { AdsService } from "../services/ads.service.ts";

const adsService = new AdsService();

export async function getAds(req: Request<GameIdRequestParams>, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;

    if (gameId) {
      const ads = await adsService.getAds(gameId);
      res.json(ads);
    }
  } catch (error) {
    next(error);
  }
}

export async function solveAd(
  req: Request<SolveAdRequestParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { gameId, adId } = req.params;

    if (gameId && adId) {
      const result = await adsService.solveAd(gameId, adId);

      res.json(result);
    }

  } catch (error) {
    next(error);
  }
}
