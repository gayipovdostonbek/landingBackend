/**
 * PostgreSQL Database Connection Pool
 * Manages database connections with proper error handling and graceful shutdown
 */

const { Pool } = require('pg');
const config = require('./env');
const logger = require('./logger');

// Create connection pool
const pool = new Pool(config.database);

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err.message, stack: err.stack });
});

// Handle pool connection
pool.on('connect', () => {
  logger.debug('New client connected to database');
});

// Handle pool removal
pool.on('remove', () => {
  logger.debug('Client removed from pool');
});

/**
 * Test database connection
 */
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    logger.info('Database connection successful', { timestamp: result.rows[0].now });
    client.release();
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error: error.message, stack: error.stack });
    throw error;
  }
};

/**
 * Execute a query
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error('Query error', { text, error: error.message, stack: error.stack });
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query;
  const originalRelease = client.release;

  // Set a timeout of 5 seconds, after which we will log this client's last query
  const timeout = setTimeout(() => {
    logger.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  // Monkey patch the query method to log queries
  client.query = (...args) => {
    client.lastQuery = args;
    return originalQuery.apply(client, args);
  };

  // Monkey patch the release method to clear timeout
  client.release = () => {
    clearTimeout(timeout);
    client.query = originalQuery;
    client.release = originalRelease;
    return originalRelease.apply(client);
  };

  return client;
};

/**
 * Gracefully close all connections
 */
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed successfully');
  } catch (error) {
    logger.error('Error closing database pool', { error: error.message });
    throw error;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
  closePool,
};
