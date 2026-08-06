import type { Request, Response, NextFunction } from "express";
import type { GamesDBResponse} from "../types/index.types.ts";
import { database } from "../config/db.ts";

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
      return next({
        success: false,
        error: { message: "Game not found or game expired.", status: 404, type: "expired"  },
      });
    }

    if (game.lives <= 0) {
      return next({
        success: false,
        error: { message: "Game over no lives remaining. Restart game to continue.", status: 400, type: "game_over" },
    });
    }

    next();
  } catch (err) {
    next({
      success: false,
      error: { message: "Failed to verify game.", status: 500, type: "verification_failed" },
    });
  }
}