import express, { type Express } from "express";
import type { Request, Response, NextFunction } from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import path from "path";
import rateLimit from "express-rate-limit";
import fs from "fs";
import type { APIError } from "../types/index.types.ts";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../swagger.config.ts";
import gameRouter from "../routes/game.routes.ts";
import reputationRouter from "../routes/reputation.routes.ts";
import adsRouter from "../routes/ads.routes.ts";
import shopRouter from "../routes/shop.routes.ts";
import { database } from "../db/config.db.ts";
import { responseMiddleware } from "../middleware/response.middleware.ts";
import { addDBIndexes } from "../db/indexes.db.ts";

const app: Express = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
} else {
  app.use(logger("dev"));
}

app.disable("x-powered-by");

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "validator.swagger.io"],
      },
    },
  }),
);

const allowedUrl = process.env.FRONTEND_URL || "";

const corsOpts: CorsOptions = {
  origin(
    origin: string | undefined,
    cb: (err: Error | null, allow?: boolean) => void,
  ) {
    if (
      !origin ||
      origin === allowedUrl ||
      process.env.NODE_ENV !== "production"
    ) {
      return cb(null, true);
    }
    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400,
};

app.use(cors(corsOpts));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max 100 requests per 15-minute window per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Protect all application endpoints
app.use(["/game", "/reputation", "/ads", "/shop"], apiLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ limit: "50kb", extended: true }));
app.use(cookieParser());

app.use(hpp());

app.use(responseMiddleware);

app.use("/game", gameRouter);
app.use("/reputation", reputationRouter);
app.use("/ads", adsRouter);
app.use("/shop", shopRouter);

const swaggerOutputPath = path.join(
  process.cwd(),
  "swagger-output.json",
);

const swaggerDocument = JSON.parse(
  fs.readFileSync(swaggerOutputPath, "utf8"),
);

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions),
);

app.use((err: APIError, __: Request, res: Response, ___: NextFunction) =>
  res.json(err),
);

await database.connect();
await addDBIndexes(database.db());

if (process.env.NODE_ENV !== "production") {
  // Start the server
  const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on http://localhost:3000");
    console.log("Swagger documentation available at http://localhost:3000/");
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down gracefully`);
    server.close(async () => {
      await database.close();
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

export default app;