import app from './src/app.js';
import { env } from './src/config/env.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { logger } from './src/utils/logger.js';

let server;

async function bootstrap() {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Start HTTP Server
    server = app.listen(env.PORT, () => {
      logger.info(`Server running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
      logger.info(`Base API endpoint: http://localhost:${env.PORT}/api/v1`);
      logger.info(`Gemini AI Model: ${env.GEMINI_MODEL}`);
    });
  } catch (error) {
    logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Graceful Shutdown
const handleShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDB();
      process.exit(0);
    });
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason: reason?.message || reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown:', { message: error.message, stack: error.stack });
  process.exit(1);
});

bootstrap();
