const { v4: uuidv4 } = require('uuid');
const redisClient = require('./redis-client');
const validator = require('./validator');
const uaParser = require('ua-parser-js');
const getServerMetric = require('./server-metrics');

module.exports.collect = async (req, res, next) => {
    try {
        const eventType = req.body.type;

        if (!!+process.env.VALIDATE_JSON_SCHEMA) {
            const validate = validator.getSchema(eventType);

            if (!validate(req.body.payload)) {
                res.status(422).json({ status: 'error', message: 'Schema validation error', errors: validate.errors });
                return;
            }
        }

        if (eventType === 'pageview') {
            (req.session.views) ? req.session.views++ : req.session.views = 1;
        }

        const data = {
            event: {
                _id: uuidv4(),
                type: req.body.type,
                payload: req.body.payload
            },
            session: {
                _id: req.session.id,
                views: req.session.views,
                previousUrl: req.session.previousUrl
            },
            userAgent: uaParser(req.headers['user-agent']),
            metrics: getServerMetric(req)
        };

        if (eventType === 'pageview') {
            req.session.ts = new Date();
            req.session.previousUrl = req.body.payload.url;
        }

        await redisClient.rPush(process.env.TRACKING_KEY, JSON.stringify(data));
        res.json({ status: 'success', eventId: data.eventId });
    } catch (err) {
        next(err);
    }
}