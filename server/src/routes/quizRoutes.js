const express = require('express');
const router = express.Router();
const { generateDynamicQuiz } = require('../controllers/dynamicQuizController');
const { getQuizForReview } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

// Generate a quiz
router.post('/generate', protect, generateDynamicQuiz);

// ✅ Get quiz for review (after submission)
router.get('/:id/review', protect, getQuizForReview);

module.exports = router;