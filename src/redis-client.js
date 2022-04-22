const { createClient } = require('redis');
const logger = require('./logger');

const options = {
    url: process.env.REDIS_URI,
    legacyMode: true // Required for connect-redis
}
const client = createClient(options);

client.on('connect', () => logger.info('Redis connected'));
client.on('error', (err) => logger.error('Redis error:', err));

module.exports = client;