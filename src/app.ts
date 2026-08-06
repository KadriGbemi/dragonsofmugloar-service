import express, { type Express } from "express";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app: Express = express();
app.use(express.json());

app.use("/game", gameRouter);
app.use("/reputation", reputationRouter);
app.use("/ads", adsRouter);
app.use("/shop", shopRouter);

// --- SWAGGER AUTOGEN & SERVER STARTUP ---
const outputFile = path.join(__dirname, "../swagger-output.json");
const endpointsFiles = [__filename];

// Swagger Autogen will generate the swagger-output.json file based on the routes and comments in this file
swaggerAutogen()(outputFile, endpointsFiles, swaggerDoc).then(() => {
  // Read the newly generated file
  const swaggerDocument = JSON.parse(fs.readFileSync(outputFile, "utf8"));

  // Mount the Swagger UI on the root route
  app.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, swaggerOptions),
  );

  // Start the server
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
    console.log("Swagger documentation available at http://localhost:3000/");
  });
});
