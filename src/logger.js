const { createLogger, format: { combine, colorize, simple }, transports } = require('winston');

const logger = createLogger({
    format: combine(
        colorize(),
        simple()
    ),
    transports: [new transports.Console()]
});

module.exports = logger;