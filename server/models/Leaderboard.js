const mongoose = require('mongoose');
const user = require('./Users');

const leaderboardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: user,
        required: true
    },
    displayName: {
        type: String,
        ref: user,
        required: true
    },
    totalScore: {
        type: Number,
        default: 0,
        min: 0
    },
    averageScore: {
        type: Number,
        default: 0,
        min: 0
    },
    quizzesTaken: {
        type: Number,
        ref: user,
        required: true
    }
}, {
    collection: 'Leaderboard'
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);