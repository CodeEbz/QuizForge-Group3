const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @route   POST /api/attempts
 * @desc    Submit a completed quiz attempt. Scoring is always computed
 *          SERVER-SIDE from the stored answer key — the client only ever
 *          sends { quizId, answers: [{ questionId, selectedOptionId }] }.
 *          This prevents users from spoofing their own score.
 * @access  Private
 */
const submitAttempt = asyncHandler(async (req, res) => {
  const { quizId, answers, timeTakenSeconds = 0 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    throw new ApiError(400, 'Invalid quizId');
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  // Build a lookup map: questionId -> question doc, for O(1) access while scoring
  const questionMap = new Map(quiz.questions.map((q) => [q._id.toString(), q]));

  let score = 0;
  const totalPossible = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  const gradedAnswers = answers.map(({ questionId, selectedOptionId }) => {
    const question = questionMap.get(questionId);
    if (!question) {
      throw new ApiError(400, `Question ${questionId} does not belong to this quiz`);
    }

    if (!selectedOptionId) {
      return {
        question: question._id,
        selectedOption: null,
        isCorrect: false,
      };
    }

    const selectedOption = question.options.find(
      (o) => o._id.toString() === selectedOptionId
    );
    if (!selectedOption) {
      throw new ApiError(400, `Option ${selectedOptionId} is invalid for question ${questionId}`);
    }

    const isCorrect = selectedOption.isCorrect === true;
    if (isCorrect) score += question.points;

    return {
      question: question._id,
      selectedOption: selectedOption._id,
      isCorrect,
    };
  });

  const percentage = totalPossible > 0 ? Math.round((score / totalPossible) * 10000) / 100 : 0;

  const attempt = await Attempt.create({
    user: req.user._id,
    quiz: quiz._id,
    answers: gradedAnswers,
    score,
    totalPossible,
    percentage,
    timeTakenSeconds,
  });

  res.status(201).json({
    success: true,
    message: 'Attempt submitted',
    data: {
      attemptId: attempt._id,
      score,
      totalPossible,
      percentage,
      correctCount: gradedAnswers.filter((a) => a.isCorrect).length,
      totalQuestions: quiz.questions.length,
    },
  });
});

/**
 * @route   GET /api/attempts/:id
 * @desc    Get a single attempt's detail (owner or admin only)
 * @access  Private
 */
const getAttemptById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const attempt = await Attempt.findById(id).populate('quiz', 'title category difficulty');
  if (!attempt) throw new ApiError(404, 'Attempt not found');

  const isOwner = attempt.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to view this attempt');
  }

  res.status(200).json({ success: true, data: attempt });
});

/**
 * @route   GET /api/attempts/my
 * @desc    Get the logged-in user's own attempt history (paginated)
 * @access  Private
 */
const getMyAttempts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const [attempts, total] = await Promise.all([
    Attempt.find({ user: req.user._id })
      .populate('quiz', 'title category difficulty')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Attempt.countDocuments({ user: req.user._id }),
  ]);

  res.status(200).json({
    success: true,
    data: attempts,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

module.exports = { submitAttempt, getAttemptById, getMyAttempts };
