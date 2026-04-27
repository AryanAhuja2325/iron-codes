const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    isHidden: {
        type: Boolean,
        default: true
    }
});

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    statement: {
        type: String,
        required: true
    },

    inputFormat: {
        type: String,
        required: true
    },

    outputFormat: {
        type: String,
        required: true
    },

    constraints: {
        type: String,
        required: true
    },

    sampleTestCases: [
        {
            input: String,
            output: String,
            explanation: String
        }
    ],

    testCases: [testCaseSchema],

    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },

    tags: [{
        type: String
    }],

    timeLimit: {
        type: Number,
        default: 1000
    },

    memoryLimit: {
        type: Number,
        default: 256
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    editorial: {
        type: String
    },

    acceptedCount: {
        type: Number,
        default: 0
    },

    submissionCount: {
        type: Number,
        default: 0
    },

    isPublished: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);