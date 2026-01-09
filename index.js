/**
 * Server Entry Point
 * Starts the Express server with graceful shutdown handling
 */

const app = require('./src/app');
const config = require('./src/config/env');
const logger = require('./src/config/logger');
const db = require('./src/config/database');

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
  process.exit(1);
});

// Start server
let server;

const startServer = async () => {
  try {
    // Test database connection (optional in development)
    try {
      await db.testConnection();
      logger.info('Database connection established');
    } catch (dbError) {
      logger.warn('Database connection failed - server will start without database', {
        error: dbError.message,
      });
      console.log(`\n⚠️  WARNING: Database connection failed!`);
      console.log(`Error: ${dbError.message}`);
      console.log(`\nServer will start without database functionality.`);
      console.log(`To fix this:`);
      console.log(`1. Make sure PostgreSQL is running`);
      console.log(`2. Check DB_PASSWORD in .env file`);
      console.log(`3. Ensure database 'landingdb' exists\n`);
    }

    // Start HTTP server
    server = app.listen(config.port, () => {
      logger.info(`Server started successfully`, {
        port: config.port,
        environment: config.nodeEnv,
        processId: process.pid,
      });
      console.log(`\n🚀 Server is running on http://localhost:${config.port}`);
      console.log(`📊 Health check: http://localhost:${config.port}/health`);
      console.log(`📝 Environment: ${config.nodeEnv}\n`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, starting graceful shutdown`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await db.closePool();
        logger.info('Database connections closed');
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown', { error: error.message });
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();
