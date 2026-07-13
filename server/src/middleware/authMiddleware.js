const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

/**
 * protect: verifies the Bearer JWT and attaches the authenticated
 * user (minus password) to req.user. Use on any route that requires login.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User belonging to this token no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired, please log in again');
    }
    throw new ApiError(401, 'Not authorized, invalid token');
  }
});

/**
 * adminOnly: restricts a route to users with role === 'admin'.
 * Must be used AFTER `protect`.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  throw new ApiError(403, 'Access denied: admin privileges required');
};

module.exports = { protect, adminOnly };
