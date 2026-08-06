import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodType, ZodError } from "zod";

type ValidationTarget = "params" | "query" | "body";

export function validate<T>(
  schema: ZodType<T>,
  target: ValidationTarget = "body",
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    req[target] = result.data as any;
    next();
  };
}
