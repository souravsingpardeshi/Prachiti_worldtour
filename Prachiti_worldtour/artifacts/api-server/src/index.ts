import app from "./app";
import { logger } from "./lib/logger";
import 'dotenv/config';
const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

import mongoose from "mongoose";

const MONGODB_URI = process.env["MONGODB_URI"];

if (!MONGODB_URI) {
  logger.warn("MONGODB_URI not provided. Skipping database connection.");
}

async function startServer() {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      logger.info("Connected to MongoDB");
    } catch (error) {
      logger.error({ error }, "Failed to connect to MongoDB");
      process.exit(1);
    }
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}

startServer();
