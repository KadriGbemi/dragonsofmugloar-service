import { type NextFunction, type Request, type Response } from "express";
import { ReputationService } from "../services/reputation.service.ts";

const reputationService = new ReputationService();

export async function investigateReputation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const game =
      req.params.gameId ??
      (await reputationService.investigateReputation(req.params.gameId));
    res.status(201).json(game);
  } catch (error) {
    next(error);
  }
}
