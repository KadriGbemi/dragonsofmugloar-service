import { type NextFunction, type Request, type Response } from "express";
import { ReputationService } from "../services/reputation.service.ts";
import type { GameIdRequestParams } from "../types/index.types.ts";

const reputationService = new ReputationService();

export async function investigateReputation(
  req: Request<GameIdRequestParams>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { gameId } = req.params;

    if (gameId) {
      const reputationResponse = await reputationService.investigateReputation(gameId);
      return res.status(201).json(reputationResponse);
    }
  } catch (error) {
    next(error);
  }
}
