const IORedis = require('ioredis');

const redis = new IORedis({
    host: process.env.REDIS_HOST,
    port: 6379,
    tls: {},                 // REQUIRED
    maxRetriesPerRequest: null
});

redis.on('connect', () => {
    console.log('Redis connected');
});

redis.on('error', (err) => {
    console.error('Redis error:', err.message);
});

module.exports = redis;