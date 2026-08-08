import serverless from "serverless-http";
import app, { initializeDatabase } from "../../src/app.ts";

const serverlessApp = serverless(app);

let initialized = false;

export const handler = async (event: any, context: any) => {
  console.log("NETLIFY PATH:", event.path);
  console.log("RAW PATH:", event.rawPath);

  if (!initialized) {
    await initializeDatabase();
    initialized = true;
  }

  return serverlessApp(event, context);
};