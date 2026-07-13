const mongoose = require('mongoose');

/**
 * Stores a snapshot of the user's answers for one question in one attempt.
 * `selectedOptionId` references the option's _id within the Quiz document.
 */
const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedOption: { type: mongoose.Schema.Types.ObjectId, required: false },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
      index: true,
    },
    answers: {
      type: [answerSchema],
      required: true,
    },
    score: {
      type: Number, // points earned
      required: true,
    },
    totalPossible: {
      type: Number, // points available in the quiz at time of attempt
      required: true,
    },
    percentage: {
      type: Number, // score / totalPossible * 100, precomputed for fast reads
      required: true,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Speeds up leaderboard aggregations (per-quiz ranking, per-user history)
attemptSchema.index({ quiz: 1, score: -1 });
attemptSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);
