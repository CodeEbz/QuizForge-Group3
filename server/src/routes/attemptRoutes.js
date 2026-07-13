const express = require('express');
const router = express.Router();

const { submitAttempt, getAttemptById, getMyAttempts } = require('../controllers/attemptController');
const { submitAttemptValidator } = require('../validators/attemptValidators');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

// All attempt routes require authentication
router.use(protect);

// POST /api/attempts - submit a quiz attempt, scored server-side
router.post('/', submitAttemptValidator, validate, submitAttempt);

// GET /api/attempts/my - the logged-in user's own attempt history
router.get('/my', getMyAttempts);

// GET /api/attempts/:id - a single attempt's detail (owner/admin only)
router.get('/:id', getAttemptById);

module.exports = router;
