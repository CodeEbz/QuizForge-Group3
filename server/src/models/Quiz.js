const mongoose = require('mongoose');

/**
 * Each question has multiple options. `isCorrect` on options is only ever
 * sent to the client on quiz CREATE (admin) responses — the public
 * "get quiz to play" endpoint strips it out (see quizController.getQuizForAttempt).
 */
const optionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, required: true, default: false },
  },
  { _id: true }
);

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true, trim: true },
    options: {
      type: [optionSchema],
      validate: {
        validator: (opts) => opts.length >= 2,
        message: 'A question must have at least 2 options',
      },
    },
    points: { type: Number, default: 1, min: 1 },
    explanation: { type: String, default: '' },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: (qs) => qs.length > 0,
        message: 'A quiz must have at least 1 question',
      },
    },
    timeLimitSeconds: {
      type: Number,
      default: 0, // 0 = no time limit
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Virtual: total possible score for the quiz (sum of question points)
quizSchema.virtual('totalPoints').get(function () {
  if (!this.questions) return 0;
  return this.questions.reduce((sum, q) => sum + q.points, 0);
});
quizSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Quiz', quizSchema);
