require('dotenv').config();
const cp = require('cookie-parser');
const express = require('express');
const connectDB = require('./config/db');
const colors = require('colors');
const { rateLimit } = require('express-rate-limit');
const cors = require('cors');
const { queue } = require('./config/queue');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
})

app.use(express.json());
app.use(cp());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true
}));


const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');
const problemRouter = require('./routes/problem.routes');
const submissionRouter = require('./routes/submission.routes');

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/problems', problemRouter);
app.use('/api/submissions', submissionRouter);

app.get('/queue-status', async (req, res) => {
    try {
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const completed = await queue.getCompleted();
        const failed = await queue.getFailed();

        res.json({
            waiting: waiting.length,
            active: active.length,
            completed: completed.length,
            failed: failed.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`.yellow);
    });
}).catch(err => {
    console.error("DB connection failed:", err);
});