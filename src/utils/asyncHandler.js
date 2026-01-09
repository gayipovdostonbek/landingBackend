/**
 * Async Handler Wrapper
 * Eliminates try-catch boilerplate in async route handlers
 */

/**
 * Wraps async functions to catch errors and pass to next()
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
