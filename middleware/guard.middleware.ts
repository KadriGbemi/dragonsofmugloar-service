import type { Request, Response, NextFunction } from "express";
import type { GamesDBResponse } from "../types/index.types.ts";
import { database } from "../db/config.db.ts";

export async function checkGameOver(
  req: Request,
  res: Response,
  next: NextFunction,
  gameId: string,
) {
  try {
    const games = database.db().collection<GamesDBResponse>("games");

    const game = await games.findOne({ gameId });

    if (!game) {
      return res.status(404).json({
        success: false,
        error: {
          message: "Game not found or game expired. Start new game.",
          type: "expired",
        },
      });
    }

    if (game.lives <= 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Game over no lives remaining. Start new game to continue.",
          type: "game_over",
        },
      });
    }

    next();
  } catch (err) {
   return res.status(500).json({
      success: false,
      error: {
        message: "Failed to verify game.",
        type: "verification_failed",
      },
    });
  }
}
