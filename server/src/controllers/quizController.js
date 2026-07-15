const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Quiz = require("../models/Quiz");

/**
 * Get a quiz for review (with correct answers)
 * GET /api/quizzes/:id/review
 */
const getQuizForReview = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);
  
  if (!quiz) {
    throw new ApiError(404, 'Quiz not found');
  }

  res.json({
    success: true,
    data: quiz
  });
});

module.exports = {
  getQuizForReview,
};