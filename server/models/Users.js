const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: /^.+\@.+\..+$/
    },
    password: {
        type: String,
        required: true,
    },
    quizzesTaken: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'Users'
});

module.exports = mongoose.model('User', userSchema);