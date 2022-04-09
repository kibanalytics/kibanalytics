const { v4: uuidv4 } = require('uuid');
const redisClient = require('./redis-client');
const validator = require('./validator');
const uaParser = require('ua-parser-js');
const metrics = require('./metrics');
const validateCollectEndpoint = validator.getSchema('collectEndpoint');

module.exports.collect = async (req, res, next) => {
    try {
        if (!validateCollectEndpoint(req.body)) {
            res.status(422).json({
                status: 'error',
                message: 'Schema validation error',
                errors: validateCollectEndpoint.errors
            });
            return;
        }

        const eventType = req.body.event.type;

        if (!!+process.env.VALIDATE_JSON_SCHEMA && eventType !== 'page-view') {
            const validate = validator.getSchema(eventType);

            if (validate === undefined) {
                res.status(422).json({ status: 'error', message: `Schema '${eventType}' not found` });
                return;
            }

            if (!validate(req.body.event?.payload)) {
                res.status(422).json({ status: 'error', message: 'Schema validation error', errors: validate.errors });
                return;
            }
        }

        if (eventType === 'page-view') {
            (req.session.views) ? req.session.views++ : req.session.views = 1;
        }

        // @TODO time delta between events, last page it was

        const url = new URL(req.body.url.href);
        const parsedUserAgent = uaParser(req.headers['user-agent']);

        const data = {
            tracker_id: req.body.tracker_id,
            url: {
                hostname: url.hostname,
                pathname: url.pathname,
                search: url.search,
                hash: url.hash,
                ...req.body.url
            },
            event: {
                _id: uuidv4(),
                type: req.body.event.type,
                payload: eventType !== 'page-view' ? req.body.event.payload : {}
            },
            device: {
                os: parsedUserAgent.os,
                cpu: parsedUserAgent.cpu,
                ...parsedUserAgent.device,
                ...req.body.device
            },
            browser: {
                engine: parsedUserAgent.engine,
                ...parsedUserAgent.browser,
                ...req.body.browser
            },
            userAgent: req.headers['user-agent'],
            session: {
                _id: req.session.id,
                views: req.session.views
            },
            ip: metrics.ip(req),
            serverSide: req.body.serverSide
        };

        await redisClient.rPush(process.env.TRACKING_KEY, JSON.stringify(data));

        res.json({ status: 'success', event_id: data.event._id });
    } catch (err) {
        next(err);
    }
}