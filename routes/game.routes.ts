import { Router } from "express";
import {
  startGame,
  gameHistory,
} from "../controllers/game.controller.ts";
import {
  playerParamsSchema,
  playerIdParamsSchema
} from "../schemas/game.schema.ts";
import { validate } from "../middleware/validate.middleware.ts";

const router = Router();

router.post(
  "/start/:playerName",
  validate(playerParamsSchema, "params"),
  startGame,
);

router.post(
  "/history/:playerId",
  validate(playerIdParamsSchema, "params"),
  gameHistory,
);

export default router;
