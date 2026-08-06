import { type NextFunction, type Request, type Response } from "express";
import type { SolveAdRequestParams } from "../types/ads.types.ts";
import type { GameIdRequestParams, GamesDBResponse } from "../types/index.types.ts";

import { AdsService } from "../services/ads.service.ts";
import { database } from "../config/db.ts";

const adsService = new AdsService();

export async function getAds(req: Request<GameIdRequestParams>, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;

    if (gameId) {
      const ads = await adsService.getAds(gameId);
      return res.json(ads);
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

    const games = database.db().collection<GamesDBResponse>("games");
    
    const result = await adsService.solveAd(gameId, adId);


    await games.updateOne(
      { gameId },
      { $set: { ...result, adSuccess: result?.success } },
    );

    return res.json(result);
  } catch (error) {
    next(error);
  }
}
