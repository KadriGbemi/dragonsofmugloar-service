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
      const errorDetails = result.error.issues
        .map((issue) => `${issue.path.join(".") || target}: ${issue.message}`)
        .join(", ");

      const errorMessage = `Validation failed: ${errorDetails}`;

      return res.error(errorMessage, 400, "VALIDATION_ERROR");
    }

    req[target] = result.data as any;
    next();
  };
}
