const mongoose = require('mongoose');

/**
 * Stores a snapshot of the user's answers for one question in one attempt.
 * `selectedOptionId` references the option's _id within the Quiz document.
 */
const answerSchema = new mongoose.Schema(
  {
    question: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true 
    },
    selectedOption: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: false 
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
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
    
    subject: {
      type: String,
      enum: [
        "JavaScript",
        "React",
        "HTML",
        "CSS",
        "MongoDB",
        "Node.js",
        "Express",
        "Python",
        "Java",
        "C++",
        "C#",
        "SQL",
        "Data Structures",
        "Algorithms",
        "Other"
      ],
      default: 'Other',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    answers: {
      type: [answerSchema],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    totalPossible: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    timeTakenSeconds: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

attemptSchema.index({ quiz: 1, score: -1 });
attemptSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);