const express = require('express');
const router = express.Router();
const { submitAttempt, getMyAttempts } = require('../controllers/attemptController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitAttempt);
router.get('/my', protect, getMyAttempts);

module.exports = router;