const { body } = require('express-validator');

const createQuizValidator = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title too long'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('category').optional().trim(),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('timeLimitSeconds').optional().isInt({ min: 0 })
    .withMessage('timeLimitSeconds must be a non-negative integer'),
  body('questions')
    .isArray({ min: 1 }).withMessage('At least 1 question is required'),
  body('questions.*.questionText')
    .notEmpty().withMessage('Each question needs questionText'),
  body('questions.*.options')
    .isArray({ min: 2 }).withMessage('Each question needs at least 2 options'),
  body('questions.*.options.*.text')
    .notEmpty().withMessage('Each option needs text'),
  body('questions.*.options.*.isCorrect')
    .isBoolean().withMessage('isCorrect must be true/false'),
  // Custom check: each question must have exactly one correct option
  body('questions').custom((questions) => {
    questions.forEach((q, i) => {
      const correctCount = (q.options || []).filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        throw new Error(
          `Question ${i + 1} must have exactly one correct option (found ${correctCount})`
        );
      }
    });
    return true;
  }),
];

module.exports = { createQuizValidator };
