require('dotenv').config();

const logger = require('./src/logger');
const redisClient = require('./src/redis-client');
const express = require('express');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const cors = require('cors');
const corsOptions = require('./src/cors-options');
const session = require('./src/session');
const controller = require('./src/controller');
const errorHandler = require('./src/error-handler');

(async () => {
    await redisClient.connect();
    const app = express();

    app.use(expressWinston.logger({
        winstonInstance: logger,
        meta: false,
        expressFormat: true,
        colorize: true
    }));

    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            integrations: [
                new Sentry.Integrations.Http({ tracing: true }),
                new Tracing.Integrations.Express({ app }),
            ],
            tracesSampleRate: 1.0,
        });

        app.use(Sentry.Handlers.requestHandler());
        app.use(Sentry.Handlers.tracingHandler());
    }

    app.use(bodyParser.json());
    app.use(session);
    app.use(express.static('public'));

    if (!!+process.env.EXPRESS_CORS) {
        app.use(cors(corsOptions));
        app.options('*', cors());
    }

    app.post('/collect', controller.collect);

    app.use(Sentry.Handlers.errorHandler());
    app.use(errorHandler);
    app.listen(process.env.EXPRESS_PORT, () => {
        logger.info(`Express app listening on port ${process.env.EXPRESS_PORT}`)
    });
})();
