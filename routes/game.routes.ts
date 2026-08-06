import { Router } from "express";
import {
  startGame,
  getGame,
  restartGame,
} from "../controllers/game.controller.ts";
import { gameParamsSchema, playerParamsSchema } from "../schemas/game.schema.ts";
import { validate } from "../middleware/middleware.validate.ts";

const router = Router();

router.post("/start/:playerName", validate(playerParamsSchema, 'params'), startGame);

router.get("/:gameId", validate(gameParamsSchema, 'params'), getGame);

router.post("/:gameId/restart", validate(gameParamsSchema, 'params'), restartGame);

export default router;
