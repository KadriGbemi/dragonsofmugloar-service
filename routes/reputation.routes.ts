import { Router } from "express";
import { investigateReputation } from "../controllers/reputation.controller.ts";
import { checkGameOver } from "../middleware/guard.middleware.ts";

const router = Router();

router.param("gameId", checkGameOver);

router.post("/:gameId/investigate/", investigateReputation);

export default router;
