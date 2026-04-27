const { Queue } = require('bullmq');

const connection = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    tls: {} // REQUIRED for AWS Redis
};

const queue = new Queue('judgeQueue', {
    connection,
    limiter: {
        max: 10,
        duration: 1000
    }
});

module.exports = { queue, connection }