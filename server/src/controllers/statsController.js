const mongoose = require('mongoose');
const Attempt = require('../models/Attempt');
const asyncHandler = require('../utils/asyncHandler');

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

  // ✅ Get recent attempts – use the attempt's own subject/difficulty
  const recentAttempts = await Attempt.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(100)
    .select('score totalPossible percentage timeTakenSeconds createdAt subject difficulty');

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
      recentAttempts: recentAttempts.map(a => ({
        _id: a._id,
        score: a.score,
        totalPossible: a.totalPossible,
        percentage: a.percentage,
        timeTakenSeconds: a.timeTakenSeconds,
        createdAt: a.createdAt,
        // ✅ Use the attempt's own fields
        subject: a.subject || 'Other',
        difficulty: a.difficulty || 'medium',
      }))
    },
  });
});

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