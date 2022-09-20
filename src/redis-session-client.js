const redisClient = require('./redis-client');

module.exports = redisClient(process.env.REDIS_SESSION_SERVER_URI, 'session');