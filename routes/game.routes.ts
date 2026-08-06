import { Router } from "express";
import {
  startGame,
  restartGame
} from "../controllers/game.controller.ts";
import { playerParamsSchema, restartGameParamsSchema } from "../schemas/game.schema.ts";
import { validate } from "../middleware/middleware.validate.ts";

const router = Router();

router.post("/start/:playerName", validate(playerParamsSchema, 'params'), startGame);

router.post("/:playerId/restart/:gameId", validate(restartGameParamsSchema, 'params'), restartGame);

export default router;
