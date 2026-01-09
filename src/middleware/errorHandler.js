/**
 * Centralized Error Handling Middleware
 * Handles all errors and sends appropriate responses
 */

const logger = require('../config/logger');
const AppError = require('../utils/AppError');

/**
 * Error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // PostgreSQL errors
  if (err.code === '23505') {
    // Duplicate key error
    error = new AppError('Duplicate field value entered', 400);
  }

  if (err.code === '23503') {
    // Foreign key violation
    error = new AppError('Invalid reference', 400);
  }

  if (err.code === '22P02') {
    // Invalid text representation
    error = new AppError('Invalid data format', 400);
  }

  // Joi validation errors
  if (err.isJoi) {
    const message = err.details.map((detail) => detail.message).join(', ');
    error = new AppError(message, 400);
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  res.status(statusCode).json({
    status,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
