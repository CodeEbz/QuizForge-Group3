const ApiError = require('../utils/ApiError');

/**
 * Catches requests to routes that don't exist and forwards a 404
 * to the error handler below, keeping response shape consistent.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

/**
 * Centralized error handler. Every thrown ApiError (and unexpected errors)
 * end up here, so the frontend always gets a predictable JSON shape:
 * { success: false, message, errors }
 */
const errorHandler = (err, req, res, next) => {
  // Determine the correct status code – try statusCode, then status, then 500
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // --- Mongoose specific overrides (these may change statusCode) ---

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key (e.g., email already registered)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already in use`;
  }

  // Mongoose schema validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Log full error stack in development only for 5xx errors
  if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
    console.error(err);
  }

  // Send consistent JSON response
  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };