// middleware/response.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import type { APIResponse, APIError } from '../types/index.types.ts';

declare global {
  namespace Express {
    interface Response {
      success: <T>(data: T, status?: number) => void;
      error: (message: string, status: number, type?: string) => void;
    }
  }
}

export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  res.success = <T>(data: T, status = 201) => {
    const body: APIResponse<T> = { success: true, data };
    res.status(status).json(body);
  };

  res.error = (message: string, status: number, type?: string) => {
    const errorPayload: APIError = { message, status, ...(type && { type }) };
    const body: APIResponse<never> = { success: false, error: errorPayload };
    res.status(status).json(body);
  };

  next();
}