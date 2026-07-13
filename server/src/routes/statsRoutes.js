const express = require('express');
const router = express.Router();

const { getMyStats, getMyStatsForQuiz } = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// GET /api/stats/me - overall stats for the logged-in user
router.get('/me', getMyStats);

// GET /api/stats/quiz/:quizId - logged-in user's stats for one quiz
router.get('/quiz/:quizId', getMyStatsForQuiz);

module.exports = router;
