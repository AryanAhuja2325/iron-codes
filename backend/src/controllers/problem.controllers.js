const Problem = require('../models/problem.model');

exports.createProblem = async (req, res) => {
    try {
        const {
            title,
            slug,
            statement,
            inputFormat,
            outputFormat,
            constraints,
            sampleTestCases,
            testCases,
            difficulty,
            tags,
            timeLimit,
            memoryLimit,
            editorial
        } = req.body;

        const existing = await Problem.findOne({ slug });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: 'Slug already exists'
            });
        }

        const problem = await Problem.create({
            title,
            slug,
            statement,
            inputFormat,
            outputFormat,
            constraints,
            sampleTestCases,
            testCases,
            difficulty,
            tags,
            timeLimit,
            memoryLimit,
            editorial,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            problem
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.getAllProblems = async (req, res) => {
    try {
        const { difficulty, tag, search } = req.query;

        let filter = { isPublished: true };

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (tag) {
            filter.tags = tag;
        }

        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        const problems = await Problem.find(filter)
            .select('-testCases')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: problems.length,
            problems
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.getProblemBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const problem = await Problem.findOne({
            slug,
            isPublished: true
        }).select('-testCases');

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        res.status(200).json({
            success: true,
            problem
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.updateProblem = async (req, res) => {
    try {
        const { id } = req.params;

        let problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        if (problem.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        problem = await Problem.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            problem
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // authorization check
        if (problem.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await problem.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Problem deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// @desc    Toggle publish/unpublish
// @route   PATCH /api/problems/:id/toggle
// @access  Protected
exports.togglePublish = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }

        // authorization check
        if (problem.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        problem.isPublished = !problem.isPublished;
        await problem.save();

        res.status(200).json({
            success: true,
            isPublished: problem.isPublished
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};