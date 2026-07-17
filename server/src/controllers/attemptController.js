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

  // ✅ Duplicate attempts are allowed – removed the 409 check

  let score = 0;
  let totalPossible = 0;
  const processedAnswers = [];

  for (const ans of answers) {
    const question = quiz.questions.id(ans.questionId);
    if (!question) {
      throw new ApiError(400, `Question ${ans.questionId} not found.`);
    }

    const points = question.points || 1;
    totalPossible += points;

    let isCorrect = false;
    if (ans.selectedOptionId) {
      const selectedOption = question.options.id(ans.selectedOptionId);
      if (!selectedOption) {
        throw new ApiError(400, `Option ${ans.selectedOptionId} not found.`);
      }
      isCorrect = selectedOption.isCorrect === true;
      if (isCorrect) {
        score += points;
      }
    }

    processedAnswers.push({
      question: ans.questionId,
      selectedOption: ans.selectedOptionId || null,
      isCorrect,
    });
  }

  // ✅ totalQuestions = number of answers submitted (20/30/50)
  const totalQuestions = answers.length;

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
      totalQuestions,
      totalPossible: attempt.totalPossible,
      percentage: attempt.percentage,
    },
  });
});

/**
 * Get current user's quiz attempts history
 * GET /api/attempts/my
 */
/**
 * Get current user's quiz attempts history
 * GET /api/attempts/my
 */
const getMyAttempts = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ user: req.user._id })
    .populate('quiz', 'title subject difficulty')
    .sort({ createdAt: -1 });

  const formatted = attempts.map((attempt) => {
    // Get the subject from quiz or attempt
    const subject = attempt.quiz?.subject || attempt.subject || 'General';
    
    // ✅ Clean title: if it contains "Pool", use subject + "Quiz"
    const rawTitle = attempt.quiz?.title || '';
    let quizTitle;
    if (rawTitle.includes('Pool') || rawTitle.includes('pool')) {
      quizTitle = `${subject} Quiz`;
    } else {
      quizTitle = rawTitle || `${subject} Quiz`;
    }

    return {
      id: attempt._id,
      quizId: attempt.quiz?._id,
      quizTitle: quizTitle, // ✅ Now shows "HTML Quiz" instead of "HTML Pool (easy)"
      subject: subject,
      difficulty: attempt.quiz?.difficulty || attempt.difficulty || 'medium',
      score: attempt.score,
      totalPossible: attempt.totalPossible,
      percentage: Math.round(attempt.percentage || 0),
      timeTakenSeconds: attempt.timeTakenSeconds || 0,
      createdAt: attempt.createdAt,
    };
  });

  res.json({
    success: true,
    data: formatted,
  });
});

module.exports = {
  submitAttempt,
  getMyAttempts,
};