import { Router } from "express";
import { investigateReputation } from "../controllers/reputation.controller.ts";
import { checkGameOver } from "../middleware/guard.middleware.ts";
import { gameParamsSchema } from "../schemas/game.schema.ts";
import { validate } from "../middleware/validate.middleware.ts";

const router = Router();

router.param("gameId", checkGameOver);

router.post(
  "/:gameId/investigate/",
  validate(gameParamsSchema, "params"),
  investigateReputation,
);

export default router;
