/**
 * Custom error class for predictable, HTTP-status-aware errors.
 * Controllers throw `new ApiError(404, 'Quiz not found')` and the
 * centralized error middleware turns it into a clean JSON response.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // for validation error arrays
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
