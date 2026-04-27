require('dotenv').config();

const connectDB = require('../config/db');

(async () => {
    try {
        await connectDB();

        const { Worker } = require('bullmq');
        const Submission = require('../models/submission.model');
        const Problem = require('../models/problem.model');
        const { executeCode } = require('../utils/executer');
        const { connection } = require('../config/queue');

        const worker = new Worker(
            'judgeQueue',
            async (job) => {
                const { submissionId } = job.data;

                try {
                    console.log('Processing job:', job.id);

                    const submission = await Submission.findById(submissionId);
                    if (!submission) return;

                    if (submission.status !== 'Pending') return;

                    const problem = await Problem.findById(submission.problem)
                        .select('testCases timeLimit');

                    if (!problem) return;

                    submission.status = 'Running';
                    await submission.save();

                    const result = await executeCode(
                        submission.code,
                        submission.language,
                        problem,
                        submission._id
                    );

                    console.log(result);

                    submission.status = result.status;
                    submission.time = result.time;
                    submission.memory = result.memory;
                    submission.failedTest = result.failedTest || null;
                    submission.error = result.error || null;

                    await submission.save();

                    console.log(`Job ${job.id} completed → ${result.status}`);

                } catch (err) {
                    console.error('Worker error:', err.message);

                    if (submissionId) {
                        await Submission.findByIdAndUpdate(submissionId, {
                            status: 'Runtime Error',
                            error: err.message
                        });
                    }
                }
            },
            {
                connection,
                concurrency: 2
            }
        );

        worker.on('completed', (job) => {
            console.log(`Completed job ${job.id}`);
        });

        worker.on('failed', (job, err) => {
            console.log(`Failed job ${job.id}:`, err.message);
        });

    } catch (err) {
        console.error('Worker init failed:', err.message);
    }
})();