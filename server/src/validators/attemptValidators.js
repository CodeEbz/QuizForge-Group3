const { body } = require('express-validator');

const submitAttemptValidator = [
  body('quizId').notEmpty().withMessage('quizId is required')
    .isMongoId().withMessage('quizId must be a valid id'),
  body('answers')
    .isArray({ min: 1 }).withMessage('answers must be a non-empty array'),
  body('answers.*.questionId')
    .notEmpty().withMessage('Each answer needs a questionId')
    .isMongoId().withMessage('questionId must be a valid id'),
  body('answers.*.selectedOptionId')
    .notEmpty().withMessage('Each answer needs a selectedOptionId')
    .isMongoId().withMessage('selectedOptionId must be a valid id'),
  body('timeTakenSeconds').optional().isInt({ min: 0 }),
];

module.exports = { submitAttemptValidator };
