/**
 * Validation Middleware
 * Validates request data against Joi schemas
 */

const AppError = require('../utils/AppError');

/**
 * Validate request data
 * @param {Object} schema - Joi validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(message, 400));
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = validate;
