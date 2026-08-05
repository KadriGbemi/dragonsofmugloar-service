import { Router } from "express";
import { investigateReputation } from "../controllers/reputation.controller.ts";

const router = Router();

router.post("/:gameId/investigate/reputation", investigateReputation);

export default router;
