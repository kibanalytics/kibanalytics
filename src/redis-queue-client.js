const redisClient = require('./redis-client');

module.exports = redisClient(process.env.REDIS_QUEUE_SERVER_URI, 'queue');