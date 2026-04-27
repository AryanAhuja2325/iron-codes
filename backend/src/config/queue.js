const { Queue } = require('bullmq');

const queue = new Queue('judgeQueue', {
    connection: {
        host: '127.0.0.1',
        port: 6379
    },
    limiter: {
        max: 10,
        duration: 1000
    }
});

module.exports = queue;