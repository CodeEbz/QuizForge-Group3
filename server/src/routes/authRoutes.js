const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidators');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', registerValidator, validate, register);

// POST /api/auth/login
router.post('/login', loginValidator, validate, login);

// GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
