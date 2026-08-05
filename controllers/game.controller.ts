import { type NextFunction, type Request, type Response } from "express";
import { GameService } from "../services/game.service.ts";

const gameService = new GameService();

export async function startGame(_: Request, res: Response, next: NextFunction) {
  try {
    const game = await gameService.startGame();
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
}

export async function getGame(req: Request, res: Response, next: NextFunction) {
  try {
    const game =
      req.params.gameId ?? (await gameService.getGame(req.params.gameId));

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
    const result = await gameService.startGame();

    res.json(result);
  } catch (error) {
    next(error);
  }
}
