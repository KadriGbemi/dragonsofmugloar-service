import { z } from "zod";

export const playerParamsSchema = z.object({
  playerName: z
    .string()
    .min(2, "Player name must be at least 2 characters long")
    .max(100, "Player name must be at most 100 characters long"),
});

export const playerIdParamsSchema = z.object({
  playerId: z.string().min(1, "Player ID cannot be empty"),
});

export const solveAdsParamsSchema = z.object({
  adId: z.string().min(1, "AdId cannot be empty"),
  gameId: z.string().min(1, "gameId cannot be empty"),
});

export const purchaseItemParamsSchema = z.object({
  adId: z.string().min(1, "AdId cannot be empty"),
  gameId: z.string().min(1, "gameId cannot be empty"),
});

export const gameParamsSchema = z.object({
  gameId: z.string().min(1, "gameId cannot be empty"),
});
