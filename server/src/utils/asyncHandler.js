/**
 * Wraps an async route/controller function and forwards any thrown error
 * to Express's error-handling middleware, avoiding repetitive try/catch blocks.
 *
 * Usage: router.get('/', asyncHandler(async (req, res) => {...}))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
