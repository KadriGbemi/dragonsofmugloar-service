import express, { type Express } from "express";
import type { Request, Response, NextFunction } from "express";
import type { APIError } from "../types/index.types.ts";
import swaggerUi from "swagger-ui-express";
import swaggerAutogen from "swagger-autogen";
import { swaggerDoc, swaggerOptions } from "../swagger.config.ts";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import gameRouter from "../routes/game.routes.ts";
import reputationRouter from "../routes/reputation.routes.ts";
import adsRouter from "../routes/ads.routes.ts";
import shopRouter from "../routes/shop.routes.ts";
import { database } from "../db/config.db.ts";
import { responseMiddleware } from "../middleware/response.middleware.ts";
import { addDBIndexes } from "../db/indexes.db.ts";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();
app.use(express.json());

app.use(responseMiddleware);

app.use("/game", gameRouter);
app.use("/reputation", reputationRouter);
app.use("/ads", adsRouter);
app.use("/shop", shopRouter);

app.use((err: APIError, __: Request, res: Response, ___: NextFunction,) => res.json(err));

// --- SWAGGER AUTOGEN & DB CONNECTION & SERVER STARTUP ---
const outputFile = path.join(__dirname, "../swagger-output.json");
const endpointsFiles = [__filename];

// Swagger Autogen will generate the swagger-output.json file based on the routes and comments in this file
swaggerAutogen()(outputFile, endpointsFiles, swaggerDoc).then(async () => {
  // Read the newly generated file
  const swaggerDocument = JSON.parse(fs.readFileSync(outputFile, "utf8"));

  // Mount the Swagger UI on the root route
  app.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions),
  );

  // Connect to MongoDB before accepting traffic
  await database.connect();
  await addDBIndexes(database.db());

  // Start the server
  const server = app.listen(3000, () => {
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
});
