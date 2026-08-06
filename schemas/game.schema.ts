import { z } from 'zod';

export const playerParamsSchema = z.object({
  playerName: z.string().min(2, 'Player name must be at least 2 characters long').max(100, 'Player name must be at most 100 characters long'),
});

export const gameParamsSchema = z.object({
  gameId: z.string().min(1, 'gameId cannot be empty'),
});