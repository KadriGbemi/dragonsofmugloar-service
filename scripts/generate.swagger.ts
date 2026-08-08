import swaggerAutogen from "swagger-autogen";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { swaggerDoc } from "../swagger.config.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFile = path.join(__dirname, "../swagger-output.json");

const endpointsFiles = [
  path.join(__dirname, "../src/app.ts"),
];


await swaggerAutogen()(outputFile, endpointsFiles, swaggerDoc);