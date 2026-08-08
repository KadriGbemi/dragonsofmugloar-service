import serverless from "serverless-http";
import app, { initializeDatabase } from "../../src/app.ts";

const serverlessApp = serverless(app);

let initialized = false;

export const handler = async (event: any, context: any) => {

  if (!initialized) {
    await initializeDatabase();
    initialized = true;
  }

  return serverlessApp(event, context);
};