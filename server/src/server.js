import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const PORT = env.PORT || 4000;

const server = app.listen(PORT, () => {
  logger.info(`CropAdvisor API server listening on http://localhost:${PORT}`, {
    port: PORT,
    environment: env.NODE_ENV,
    clientOrigin: env.CLIENT_ORIGIN,
  });
});

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forcefully terminating server after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
