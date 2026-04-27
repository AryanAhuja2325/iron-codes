const { Queue } = require('bullmq');

const queue = new Queue('judgeQueue', {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    limiter: {
        max: 10,
        duration: 1000
    }
});

module.exports = queue;