export type PurchaseShopItemParams = {
  gameId: string;
  itemId: string;
};

export type PurchaseShopItemResponse = {
  shoppingSuccess: string;
  gold: number;
  lives: number;
  level: number;
  turn: number;
};

export type ShopItem = {
  id: string;
  name: string;
  cost: number;
};

export type ShopItemsResponse = ShopItem[];
