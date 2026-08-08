import { type NextFunction, type Request, type Response } from "express";
import { GameService } from "../services/game.service.ts";
import type {
  StartGameRequestParams,
  GameHistoryRequestParams,
} from "../types/game.types.ts";
import type { GamesDBResponse } from "../types/index.types.ts";
import { database } from "../db/config.db.ts";
import { MongoServerError } from "mongodb";

const gameService = new GameService();

export async function startGame(
  req: Request<StartGameRequestParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { playerName } = req.params;

    if (!playerName) {
      return res.error("Player name is required", 400);
    }

    try {
      const games = database.db().collection<GamesDBResponse>("games");

      const existingPlayer = await games.findOne({ playerName });

      const game = await gameService.startGame();

      const playerId = existingPlayer?.playerId ?? crypto.randomUUID();
      const result = await games.insertOne({
        ...game,
        playerName,
        playerId,
        createdAt: new Date(),
      });

      return res.success({
        ...game,
        playerName,
        id: result.insertedId,
        playerId,
      });
    } catch (err) {
      // Safety net in case two requests race past the findOne check above
      if (err instanceof MongoServerError && err.code === 11000) {
        res.error("Player name already exists", 409, "duplicate_player_name");
        return;
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
}

export async function gameHistory(
  req: Request<GameHistoryRequestParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { playerId } = req.params;

    if (!playerId) {
      return res.error("Player ID is required", 400);
    }

    const games = database.db().collection<GamesDBResponse>("games");
    const results = await games
      .find({ playerId })
      .sort({ createdAt: -1 })
      .toArray();

    if (results.length === 0) {
      return res.error("No games found for this player", 404);
    }

    return res.success(results);
  } catch (error) {
    next(error);
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.error("Game ID is required", 400);
    }

    const games = database.db().collection<GamesDBResponse>("games");

    const game = await games.findOne({ gameId });

    if (!game) {
      return res.error("Game not found", 404);
    }

    return res.success(game);
  } catch (error) {
    next(error);
  }
}
