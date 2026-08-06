import type { z } from 'zod';
import type { gameParamsSchema } from '../schemas/game.schema.ts';
import type { GameResponse } from './game.types.ts';

export interface GamesDBResponse extends GameResponse {
  playerName: string;
  playerId: string;
  createdAt: Date;
}

export type GameIdRequestParams = z.infer<typeof gameParamsSchema>;