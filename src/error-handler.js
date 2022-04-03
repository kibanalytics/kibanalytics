const logger = require('./logger');

module.exports = (err, req, res, next) => {
    logger.error(err?.stack);

    if (res.headersSent) {
        return next(err);
    }

    switch (err.message) {
        default: {
            const response = { status: 'error', message: 'Internal server error' };
            if (process.env.SENTRY_DSN) response.error_id = res.sentry;

            res.status(500);
            res.json(response);
        }
    }
}