const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator's chain of checks (e.g. body('email').isEmail()).
 * If any validation failed, responds with a clean 422 + list of field errors
 * instead of letting the request reach the controller.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  throw new ApiError(422, 'Validation failed', formatted);
};

module.exports = validate;
