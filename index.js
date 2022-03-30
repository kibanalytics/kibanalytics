require('dotenv').config();

const logger = require('./src/logger');
const redisClient = require('./src/redis-client');
const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const session = require('./src/session');
const controller = require('./src/controller');

(async () => {
    await redisClient.connect();
    const app = express();

    app.use(expressWinston.logger({
        winstonInstance: logger,
        meta: true,
        expressFormat: true,
        colorize: true
    }));
    app.use(bodyParser.json());
    app.use(session);
    app.use(express.static('public'));

    app.post('/collect', controller.collect);

    app.listen(process.env.EXPRESS_PORT, () => {
        logger.info(`Express app listening on port ${process.env.EXPRESS_PORT}`)
    });
})();
