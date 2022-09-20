const { createClient } = require('redis');
const logger = require('./logger');

module.exports = (uri, tag) => {
    const options = {
        url: uri,
        legacyMode: true // Required for connect-redis
    }
    const client = createClient(options);

    client.on('connect', () => logger.info(`Redis ${tag} connected`));
    client.on('error', (err) => logger.error(`Redis ${tag} error:`, err));

    return client;
}