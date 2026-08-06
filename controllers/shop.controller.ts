import { type NextFunction, type Request, type Response } from "express";
import type { PurchaseShopItemParams } from "../types/shop.types.ts";
import { ShopService } from "../services/shop.service.ts";
import type { GameIdRequestParams, GamesDBResponse } from "../types/index.types.ts";
import { database } from "../config/db.ts";

const shopService = new ShopService();

export async function getShopItems(req: Request<GameIdRequestParams>, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;

    if (gameId) {
      const items = await shopService.getShopItems(gameId);
      return res.success(items);
    }
  } catch (error) {
    next(error);
  }
}

export async function purchaseShopItem(
  req: Request<PurchaseShopItemParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { gameId, itemId } = req.params;

    if (gameId && itemId) {
      const result = await shopService.purchaseShopItem(gameId, itemId);

        const games = database.db().collection<GamesDBResponse>("games");

        await games.updateOne(
          { gameId },
          { $set: { ...result } },
        );

      return res.success(result);
    }

  } catch (error) {
    next(error);
  }
}
