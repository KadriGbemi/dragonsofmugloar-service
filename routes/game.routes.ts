import { Router } from "express";
import {
  startGame,
  getGame,
  restartGame,
} from "../controllers/game.controller.ts";

const router = Router();

router.post("/start", startGame);

router.get("/:gameId", getGame);

router.post("/:gameId/restart", restartGame);

export default router;
