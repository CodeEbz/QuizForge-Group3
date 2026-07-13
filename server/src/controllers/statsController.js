const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/stats/me
 * @desc    Aggregate statistics for the logged-in user:
 *          total attempts, average score/percentage, best score,
 *          and their most recent attempts for a quick history view.
 * @access  Private
 */
const getMyStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [summary] = await Attempt.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$user',
        totalAttempts: { $sum: 1 },
        totalScore: { $sum: '$score' },
        averagePercentage: { $avg: '$percentage' },
        bestPercentage: { $max: '$percentage' },
        averageTimeTakenSeconds: { $avg: '$timeTakenSeconds' },
      },
    },
    {
      $project: {
        _id: 0,
        totalAttempts: 1,
        totalScore: 1,
        averagePercentage: { $round: ['$averagePercentage', 2] },
        bestPercentage: { $round: ['$bestPercentage', 2] },
        averageTimeTakenSeconds: { $round: ['$averageTimeTakenSeconds', 0] },
      },
    },
  ]);

  const recentAttempts = await Attempt.find({ user: userId })
    .populate('quiz', 'title category difficulty')
    .sort({ createdAt: -1 })
    .limit(5)
    .select('score totalPossible percentage createdAt quiz');

  res.status(200).json({
    success: true,
    data: {
      summary: summary || {
        totalAttempts: 0,
        totalScore: 0,
        averagePercentage: 0,
        bestPercentage: 0,
        averageTimeTakenSeconds: 0,
      },
      recentAttempts,
    },
  });
});

/**
 * @route   GET /api/stats/quiz/:quizId
 * @desc    Aggregate stats for how the logged-in user has performed
 *          specifically on ONE quiz (useful for "your progress" views).
 * @access  Private
 */
const getMyStatsForQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const userId = req.user._id;

  const [summary] = await Attempt.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        quiz: new mongoose.Types.ObjectId(quizId),
      },
    },
    {
      $group: {
        _id: null,
        attempts: { $sum: 1 },
        bestScore: { $max: '$score' },
        bestPercentage: { $max: '$percentage' },
        lastAttemptAt: { $max: '$createdAt' },
      },
    },
    { $project: { _id: 0, attempts: 1, bestScore: 1, bestPercentage: { $round: ['$bestPercentage', 2] }, lastAttemptAt: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: summary || { attempts: 0, bestScore: 0, bestPercentage: 0, lastAttemptAt: null },
  });
});

module.exports = { getMyStats, getMyStatsForQuiz };
