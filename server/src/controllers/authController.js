const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password since the schema excludes it by default
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get the currently authenticated user's profile
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    },
  });
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Simulated forgot password email dispatch
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists for this email, you will receive password reset instructions shortly.'
    });
  }

  console.log(`[PASSWORD RESET SIMULATION] Reset requested for user: ${user.name} (${user.email})`);

  res.status(200).json({
    success: true,
    message: 'If an account exists for this email, you will receive password reset instructions shortly. (Reset simulated successfully)'
  });
});

module.exports = { register, login, getMe, forgotPassword };
