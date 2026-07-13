const express = require('express');
const router = express.Router();

const { getOverallLeaderboard, getQuizLeaderboard } = require('../controllers/leaderboardController');

// GET /api/leaderboard - overall leaderboard, public
router.get('/', getOverallLeaderboard);

// GET /api/leaderboard/quiz/:quizId - per-quiz leaderboard, public
router.get('/quiz/:quizId', getQuizLeaderboard);

module.exports = router;
