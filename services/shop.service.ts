import { dragonsClient } from "../clients/dragonsofmugloar/api.ts";
import type {
  ShopItemsResponse,
  PurchaseShopItemResponse,
} from "../types/shop.types.ts";

export class ShopService {
  public async getShopItems(gameId: string) {
    return dragonsClient.get<ShopItemsResponse>(`/${gameId}/shop`);
  }

  public async purchaseShopItem(gameId: string, itemId: string) {
    return dragonsClient.post<PurchaseShopItemResponse>(
      `/${gameId}/shop/buy/${itemId}`,
    );
  }
}
