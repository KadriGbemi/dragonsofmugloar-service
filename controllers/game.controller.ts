import { type NextFunction, type Request, type Response } from "express";
import { GameService } from "../services/game.service.ts";
import type { StartGameRequestParams } from "../types/game.types.ts";
import type { GamesDBResponse } from "../types/index.types.ts";
import { database } from "../db/config.db.ts";
import { MongoServerError } from "mongodb";

const gameService = new GameService();

export async function startGame(req: Request<StartGameRequestParams>, res: Response, next: NextFunction) {
  try {
    const { playerName } = req.params;

    if (!playerName) {
      return res.error("Player name is required", 400);
    }

    const games = database.db().collection<GamesDBResponse>("games");

    const existingGame = await games.findOne({ playerName });
    if (existingGame) {
      return res.error("Player name already exists", 409, "duplicate_player_name");
    }

    const game = await gameService.startGame();

    try {
      const playerId = crypto.randomUUID();
      const result = await games.insertOne({
        ...game,
        playerName,
        playerId,
        createdAt: new Date(),
      });

      return res.success({ ...game, playerName, id: result.insertedId, playerId });
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

export async function nextGame(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { playerId, gameId } = req.params;

    if (!playerId || !gameId) {
      return res.error("Player ID and Game ID are required", 400);
    }

    const games = database.db().collection<GamesDBResponse>("games");

    const existingPlayer = await games.findOne({ playerId, gameId });

    const existingPlayerId = existingPlayer?.playerId

    if (!existingPlayerId) {
      return res.error("Cannot start new game. Player does not exist", 400, 'missing_player');
    }

    const game = await gameService.startGame();

    const playerName = existingPlayer?.playerName;

    const result = await games.insertOne({
      ...game,
      playerName,
      playerId: existingPlayerId,
      createdAt: new Date(),
    });

    return res.success({ ...game, playerName, id: result.insertedId, playerId });


  } catch (error) {
    next(error);
  }
}


export async function gameHistory(req: Request<StartGameRequestParams>, res: Response, next: NextFunction) {
  try {
    const { playerName } = req.params;

    if (!playerName) {
      return res.error("Player name is required", 400);
    }

    const games = database.db().collection<GamesDBResponse>("games");
    const results = await games
      .find({ playerName })
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