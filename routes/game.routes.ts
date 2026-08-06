import { Router } from "express";
import {
  startGame,
  nextGame
} from "../controllers/game.controller.ts";
import { playerParamsSchema, restartGameParamsSchema } from "../schemas/game.schema.ts";
import { validate } from "../middleware/validate.middleware.ts";

const router = Router();

router.post("/start/:playerName", validate(playerParamsSchema, 'params'), startGame);

router.post("/:playerId/:gameId/next", validate(restartGameParamsSchema, 'params'), nextGame);

export default router;
