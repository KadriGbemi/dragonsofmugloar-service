import { type NextFunction, type Request, type Response } from "express";
import { GameService } from "../services/game.service.ts";
import type { StartGameRequestParams } from "../types/game.types.ts";
import type { GamesDBResponse } from "../types/index.types.ts";
import { database } from "../config/db.ts";
import { MongoServerError } from "mongodb";

const gameService = new GameService();

export async function startGame(req: Request<StartGameRequestParams>, res: Response, next: NextFunction) {
  try {
    const { playerName } = req.params;

    if (!playerName) {
      res.status(400).json({ error: "Player name is required" });
      return;
    }

    const games = database.db().collection<GamesDBResponse>("games");

    const existingGame = await games.findOne({ playerName });
    if (existingGame) {
      res.status(409).json({ error: "Player name already exists" });
      return;
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

      res.status(201).json({ ...game, playerName, id: result.insertedId, playerId });
    } catch (err) {
      // Safety net in case two requests race past the findOne check above
      if (err instanceof MongoServerError && err.code === 11000) {
        res.status(409).json({ error: "Player name already exists" });
        return;
      }
      throw err;
    }
  } catch (error) {
    next(error);
  }
}

export async function restartGame(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { playerId, gameId } = req.params;

    if (!playerId || !gameId) {
      res.status(400).json({ error: "Player ID and Game ID are required" });
      return;
    }

    const games = database.db().collection<GamesDBResponse>("games");

    const existingPlayer = await games.findOne({ playerId, gameId });

    const previousLives = existingPlayer?.lives || 0;

    if (previousLives >= 0) {
      return res.status(409).json({ error: "Cannot restart game until all lives are used up" });
    }

    if (existingPlayer) {
      const game = await gameService.startGame();

      const playerName = existingPlayer?.playerName;

      const playerId = crypto.randomUUID();
      const result = await games.insertOne({
        ...game,
        playerName,
        playerId,
        createdAt: new Date(),
      });

      return res.status(201).json({ ...game, playerName, id: result.insertedId, playerId });
    }

  } catch (error) {
    next(error);
  }
}
