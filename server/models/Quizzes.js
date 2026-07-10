const mongoose = require('mongoose');
const user = require('./Users');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
    userAnswer: String,
    explanation: String
});

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    subject: {
        type: String,
        required: true,
        enum: ["JavaScript", "React", "HTML", "CSS", "MongoDB", "Node.js", "Express.js",  "Python", "Java", "C++", "C#", "SQL", "Data Structure", "Algorithms", "Others"]
    },
    difficulty: {
        type: String,
        required: true,
        enum: ["Easy", "Medium", "Hard"]
    },
    totalQuestions: {
        type: Number,
        required: true,
        enum: [20, 30, 50]
    },
    score: {
        type: Number,
        min: 0
    },
    questions: [questionSchema],
    submittedAt: {
        type: Date,
        default: Date.now
    }
},{
    collection: 'Quizzes'
});

module.exports = mongoose.model('Quiz', quizSchema);