const logger = require('./logger');

module.exports = (err, req, res, next) => {
    logger.error(err?.stack);

    if (res.headersSent) {
        return next(err);
    }

    switch (err.message) {
        default: {
            res.status(500);
            res.json({ status: 'error', message: 'Internal server error' });
        }
    }
}