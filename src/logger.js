const { createLogger, format, transports } = require('winston');
const { combine, colorize, splat, timestamp, printf } = format;

const custom = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} \x1b[34m${process.pid}\x1b[0m ${level}: ${message} `;

    if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata)
    }

    return msg
});

const logger = createLogger({
    format: combine(
        colorize(),
        splat(),
        timestamp(),
        custom
    ),
    transports: [new transports.Console()]
});

module.exports = logger;