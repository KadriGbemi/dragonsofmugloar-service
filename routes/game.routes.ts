import { Router } from "express";
import {
  getGame,
  startGame,
  gameHistory,
} from "../controllers/game.controller.ts";
import {
  playerParamsSchema,
  playerIdParamsSchema,
  gameParamsSchema,
} from "../schemas/game.schema.ts";
import { validate } from "../middleware/validate.middleware.ts";

const router = Router();

router.get("/:gameId", validate(gameParamsSchema, "params"), getGame);

router.post(
  "/start/:playerName",
  validate(playerParamsSchema, "params"),
  startGame,
);

router.get(
  "/history/:playerId",
  validate(playerIdParamsSchema, "params"),
  gameHistory,
);

export default router;
