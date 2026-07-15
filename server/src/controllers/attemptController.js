const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Attempt = require("../models/Attempt");
const Quiz = require("../models/Quiz");

/**
 * Submit a quiz attempt
 * POST /api/attempts
 */
const submitAttempt = asyncHandler(async (req, res) => {
  const { quizId, answers, timeTakenSeconds } = req.body;

  if (!quizId || !answers || !Array.isArray(answers)) {
    throw new ApiError(400, "Quiz ID and answers are required.");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found.");
  }

  let score = 0;
  const processedAnswers = [];

  for (const ans of answers) {
    const question = quiz.questions.id(ans.questionId);
    if (!question) {
      throw new ApiError(400, `Question ${ans.questionId} not found.`);
    }

    let isCorrect = false;
    if (ans.selectedOptionId) {
      const selectedOption = question.options.id(ans.selectedOptionId);
      if (!selectedOption) {
        throw new ApiError(400, `Option ${ans.selectedOptionId} not found.`);
      }
      isCorrect = selectedOption.isCorrect === true;
      if (isCorrect) {
        score += question.points || 1;
      }
    }

    processedAnswers.push({
      question: ans.questionId,
      selectedOption: ans.selectedOptionId || null,
      isCorrect,
    });
  }

    const existingAttempt = await Attempt.findOne({ user: req.user._id, quiz: quizId });
    if (existingAttempt) {
      throw new ApiError(409, 'You have already submitted this quiz. Duplicate attempts are not allowed.');
    }

  const totalPossible = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);
  const percentage = totalPossible > 0 ? (score / totalPossible) * 100 : 0;

  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quizId,
    subject: quiz.subject,
    difficulty: quiz.difficulty,
    answers: processedAnswers,
    score,
    totalPossible,
    percentage,
    timeTakenSeconds: timeTakenSeconds || 0,
  });

  res.status(201).json({
    success: true,
    message: "Quiz attempt submitted successfully.",
    data: {
      attemptId: attempt._id,
      score: attempt.score,
      totalQuestions: quiz.questionCount,
      totalPossible: attempt.totalPossible,
      percentage: attempt.percentage,
    },
  });
});

/**
 * Get current user's quiz attempts history
 * GET /api/attempts/my
 */
const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ user: req.user._id })
    .populate('quiz', 'title subject difficulty')
    .sort({ createdAt: -1 });

  const formatted = attempts.map((attempt) => ({
    id: attempt._id,
    quizId: attempt.quiz?._id,
    quizTitle: attempt.quiz?.title || (attempt.subject ? `${attempt.subject} Quiz` : 'Untitled Quiz'),
    // ✅ FIXED: Use quiz.subject FIRST, then attempt.subject as fallback
    subject: attempt.quiz?.subject || attempt.subject || 'General',
    difficulty: attempt.quiz?.difficulty || attempt.difficulty || 'medium',
    score: attempt.score,
    totalPossible: attempt.totalPossible,
    percentage: Math.round(attempt.percentage || 0),
    timeTakenSeconds: attempt.timeTakenSeconds || 0,
    createdAt: attempt.createdAt,
  }));

  res.json({
    success: true,
    data: formatted,
  });
});

module.exports = {
  submitAttempt,
  getMyAttempts,
};