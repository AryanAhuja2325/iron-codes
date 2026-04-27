const Submission = require('../models/submission.model');
const { queue } = require('../config/queue');
const crypto = require('crypto');

const getCodeHash = (code) => {
    const normalized = code
        .replace(/\s+/g, ' ')
        .trim();

    return crypto
        .createHash('sha256')
        .update(normalized)
        .digest('hex');
};

exports.createSubmission = async (req, res) => {
    try {
        const { problemId, code, language } = req.body;
        const userId = req.user._id;

        const codeHash = getCodeHash(code);

        const existing = await Submission.findOne({
            user: userId,
            problem: problemId,
            codeHash
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted this code'
            });
        }

        const lastSubmission = await Submission.findOne({
            user: userId,
            problem: problemId
        }).sort({ createdAt: -1 });

        const COOLDOWN = 10 * 1000;

        if (lastSubmission) {
            const diff = Date.now() - new Date(lastSubmission.createdAt).getTime();

            if (diff < COOLDOWN) {
                return res.status(429).json({
                    success: false,
                    message: `Wait ${Math.ceil((COOLDOWN - diff) / 1000)}s before submitting again`
                });
            }
        }

        const WINDOW = 60 * 1000;
        const LIMIT = 5;

        const count = await Submission.countDocuments({
            user: userId,
            createdAt: { $gte: new Date(Date.now() - WINDOW) }
        });

        if (count >= LIMIT) {
            return res.status(429).json({
                success: false,
                message: 'Too many submissions. Try later.'
            });
        }

        const submission = await Submission.create({
            user: userId,
            problem: problemId,
            code,
            language,
            codeHash
        });

        await queue.add('judge', {
            submissionId: submission._id
        });

        return res.status(201).json({
            success: true,
            submissionId: submission._id
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.getSubmission = async (req, res) => {
    try {
        const submission = await Submission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        return res.status(200).json({
            success: true,
            submission
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};