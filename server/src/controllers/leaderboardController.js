const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @route   GET /api/leaderboard
 * @desc    Overall leaderboard across ALL quizzes. Ranks users by total
 *          score earned across all their attempts (sum), with total
 *          attempts and average percentage as tiebreak context.
 * @access  Public
 * @query   limit (default 20, max 100)
 */
const getOverallLeaderboard = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

  const leaderboard = await Attempt.aggregate([
    {
      $group: {
        _id: '$user',
        totalScore: { $sum: '$score' },
        totalAttempts: { $sum: 1 },
        averagePercentage: { $avg: '$percentage' },
        bestPercentage: { $max: '$percentage' },
      },
    },
    { $sort: { totalScore: -1, averagePercentage: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        totalScore: 1,
        totalAttempts: 1,
        averagePercentage: { $round: ['$averagePercentage', 2] },
        bestPercentage: { $round: ['$bestPercentage', 2] },
      },
    },
  ]);

  // Attach 1-based rank for easy rendering on the frontend
  const ranked = leaderboard.map((entry, i) => ({ rank: i + 1, ...entry }));

  res.status(200).json({ success: true, data: ranked });
});

/**
 * @route   GET /api/leaderboard/quiz/:quizId
 * @desc    Leaderboard for ONE specific quiz. Each user's BEST attempt
 *          on that quiz counts (not every attempt), which is the standard
 *          expectation for quiz leaderboards.
 * @access  Public
 * @query   limit (default 20, max 100)
 */
const getQuizLeaderboard = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    throw new ApiError(400, 'Invalid quizId');
  }
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);

  const leaderboard = await Attempt.aggregate([
    { $match: { quiz: new mongoose.Types.ObjectId(quizId) } },
    { $sort: { score: -1, timeTakenSeconds: 1 } }, // best score wins; faster time is tiebreaker
    {
      $group: {
        _id: '$user',
        bestScore: { $first: '$score' },
        bestPercentage: { $first: '$percentage' },
        timeTakenSeconds: { $first: '$timeTakenSeconds' },
        attemptsOnThisQuiz: { $sum: 1 },
      },
    },
    { $sort: { bestScore: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: 0,
        userId: '$_id',
        name: '$user.name',
        bestScore: 1,
        bestPercentage: { $round: ['$bestPercentage', 2] },
        timeTakenSeconds: 1,
        attemptsOnThisQuiz: 1,
      },
    },
  ]);

  const ranked = leaderboard.map((entry, i) => ({ rank: i + 1, ...entry }));

  res.status(200).json({ success: true, data: ranked });
});

module.exports = { getOverallLeaderboard, getQuizLeaderboard };
