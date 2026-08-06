import type { z } from 'zod';
import type { gameParamsSchema, playerParamsSchema } from '../schemas/game.schema.ts';

export interface GameResponse {
  gameId: string;
  lives: number;
  gold: number;
  level: number;
  score: number;
  highScore: number;
  turn: number;
}

export type GameIdRequestParams = z.infer<typeof gameParamsSchema>;

export type StartGameRequestParams = z.infer<typeof playerParamsSchema>;