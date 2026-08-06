import type { z } from 'zod';
import type { gameParamsSchema } from '../schemas/game.schema.ts';

export type GameIdRequestParams = z.infer<typeof gameParamsSchema>;