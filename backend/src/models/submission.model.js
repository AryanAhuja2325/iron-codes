const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        enum: ['cpp', 'python', 'java'],
        required: true
    },
    status: {
        type: String,
        enum: [
            'Pending',
            'Running',
            'Accepted',
            'Wrong Answer',
            'Time Limit Exceeded',
            'Runtime Error',
            'Compile Error'
        ],
        default: 'Pending'
    },
    codeHash: {
        type: String,
        required: true
    },
    error: String,
    time: Number,
    memory: Number,
    failedTest: Number
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);