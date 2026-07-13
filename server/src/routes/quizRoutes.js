const express = require('express');
const router = express.Router();

const {
  createQuiz,
  getQuizzes,
  getQuizById,
  getQuizForAttempt,
  updateQuiz,
  deleteQuiz,
} = require('../controllers/quizController');
const { createQuizValidator } = require('../validators/quizValidators');
const validate = require('../middleware/validateMiddleware');
const { protect } = require('../middleware/authMiddleware');

// GET /api/quizzes - public list (metadata only)
router.get('/', getQuizzes);

// POST /api/quizzes - create a quiz (must be logged in)
router.post('/', protect, createQuizValidator, validate, createQuiz);

// GET /api/quizzes/:id/play - sanitized version for taking the quiz
router.get('/:id/play', protect, getQuizForAttempt);

// GET /api/quizzes/:id - full detail (owner/admin use, includes answer key)
router.get('/:id', protect, getQuizById);

// PUT /api/quizzes/:id - update (owner or admin only, enforced in controller)
router.put('/:id', protect, updateQuiz);

// DELETE /api/quizzes/:id - delete (owner or admin only, enforced in controller)
router.delete('/:id', protect, deleteQuiz);

module.exports = router;
