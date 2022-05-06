const { createClient } = require('redis');
const logger = require('./logger');

const options = {
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true // Required for connect-redis
}
const client = createClient(options);

client.on('connect', () => logger.info('Redis connected'));
client.on('error', (err) => logger.error('Redis error:', err));

module.exports = client;