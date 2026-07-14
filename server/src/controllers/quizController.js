const mongoose = require('mongoose');
const Quiz = require('../models/Quiz');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

/**
 * @route   POST /api/quizzes
 * @desc    Create a new quiz with questions + options
 * @access  Private (any logged-in user can author a quiz; restrict to
 *          adminOnly in the route if you want quiz creation locked down)
 */
const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, category, difficulty, questions, timeLimitSeconds, isPublished } = req.body;

  const quiz = await Quiz.create({
    title,
    description,
    category,
    difficulty,
    questions,
    timeLimitSeconds,
    isPublished,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Quiz created successfully',
    data: quiz,
  });
});

/**
 * @route   GET /api/quizzes
 * @desc    List quizzes (paginated, optionally filtered by category/difficulty)
 *          Returns quiz metadata only, NOT full question/option details,
 *          to keep the list view lightweight for the React app.
 * @access  Public
 */
const getQuizzes = asyncHandler(async (req, res) => {
  const { category, difficulty, page = 1, limit = 10 } = req.query;

  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .select('title description category difficulty timeLimitSeconds createdAt questions')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
    Quiz.countDocuments(filter),
  ]);

  // Attach a lightweight questionCount instead of exposing full questions array
  const shaped = quizzes.map(({ questions, ...rest }) => ({
    ...rest,
    questionCount: questions.length,
  }));

  res.status(200).json({
    success: true,
    data: shaped,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get full quiz detail for ADMIN/OWNER view (includes correct answers)
 * @access  Private
 */
const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid quiz id');
  }

  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  res.status(200).json({ success: true, data: quiz });
});

/**
 * @route   GET /api/quizzes/:id/play
 * @desc    Get a quiz formatted for a user to ATTEMPT — strips `isCorrect`
 *          from every option so the answer key never reaches the client.
 * @access  Private
 */
const getQuizForAttempt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid quiz id');
  }

  const quiz = await Quiz.findOne({ _id: id, isPublished: true }).lean();
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  const sanitized = {
    ...quiz,
    questions: quiz.questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      points: q.points,
      explanation: q.explanation || '',
      options: q.options.map((o) => ({ _id: o._id, text: o.text })),
    })),
  };

  res.status(200).json({ success: true, data: sanitized });
});

/**
 * @route   PUT /api/quizzes/:id
 * @desc    Update a quiz (only its creator or an admin may edit)
 * @access  Private
 */
const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  const isOwner = quiz.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to edit this quiz');
  }

  const updatable = ['title', 'description', 'category', 'difficulty', 'questions', 'timeLimitSeconds', 'isPublished'];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) quiz[field] = req.body[field];
  });

  await quiz.save();
  res.status(200).json({ success: true, message: 'Quiz updated', data: quiz });
});

/**
 * @route   DELETE /api/quizzes/:id
 * @desc    Delete a quiz (only its creator or an admin may delete)
 * @access  Private
 */
const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id);
  if (!quiz) throw new ApiError(404, 'Quiz not found');

  const isOwner = quiz.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this quiz');
  }

  await quiz.deleteOne();
  res.status(200).json({ success: true, message: 'Quiz deleted' });
});

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  getQuizForAttempt,
  updateQuiz,
  deleteQuiz,
};
