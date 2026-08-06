import { type NextFunction, type Request, type Response } from "express";
import type { PurchaseShopItemParams } from "../types/shop.types.ts";
import { ShopService } from "../services/shop.service.ts";
import type { GameIdRequestParams } from "../types/index.types.ts";

const shopService = new ShopService();

export async function getShopItems(req: Request<GameIdRequestParams>, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;

    if(gameId) {
      const items = await shopService.getShopItems(gameId);
      res.json(items);
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

      res.json(result);
    }

  } catch (error) {
    next(error);
  }
}
