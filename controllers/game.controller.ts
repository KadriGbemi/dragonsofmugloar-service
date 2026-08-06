import { type NextFunction, type Request, type Response } from "express";
import { GameService } from "../services/game.service.ts";
import type { StartGameRequestParams } from "../types/game.types.ts";

const gameService = new GameService();

export async function startGame(req: Request<StartGameRequestParams>, res: Response, next: NextFunction) {
  try {
    const { playerName } = req.params;

    // Check if playerName is provided in DB if not, continue to start a new game

    if (!playerName) {
      res.status(400).json({ error: "Player name is required" });
      return;
    }

    const game = await gameService.startGame();

    // Playername is db
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction) {
  try {
    const { gameId } = req.params;

    const game = gameId ?? (await gameService.getGame(gameId));

    res.json(game);
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
    // Needs to implement a db in the service layer to restart the game
    // const result = await gameService.startGame();

    // res.json(result);
  } catch (error) {
    next(error);
  }
}
