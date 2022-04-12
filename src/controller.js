const { v4: uuidv4 } = require('uuid');
const redisClient = require('./redis-client');
const validator = require('./validator');
const uaParser = require('ua-parser-js');
const metrics = require('./metrics');
const validateCollectEndpoint = validator.getSchema('collectEndpoint');

module.exports.collect = async (req, res, next) => {
    try {
        const { session, body } = req;

        if (!validateCollectEndpoint(body)) {
            res.status(422).json({
                status: 'error',
                message: 'Schema validation error',
                errors: validateCollectEndpoint.errors
            });
            return;
        }

        const eventType = body.event.type;

        if (!!+process.env.VALIDATE_JSON_SCHEMA && eventType !== 'page-view') {
            const validate = validator.getSchema(eventType);

            if (validate === undefined) {
                res.status(422).json({ status: 'error', message: `Schema '${eventType}' not found` });
                return;
            }

            if (!validate(body.event?.payload)) {
                res.status(422).json({ status: 'error', message: 'Schema validation error', errors: validate.errors });
                return;
            }
        }

        if (eventType === 'page-view') {
            (session.views) ? session.views++ : session.views = 1;
        }
        (session.events) ? session.events++ : session.events = 1;

        // @TODO time delta between events, last page it was

        const url = new URL(body.url.href);
        const parsedUserAgent = uaParser(req.headers['user-agent']);

        const data = {
            tracker_id: body.tracker_id,
            url: {
                hostname: url.hostname,
                pathname: url.pathname,
                search: url.search,
                hash: url.hash,
                ...body.url
            },
            event: {
                _id: uuidv4(),
                ts: {
                    ...body.event.ts,
                    lastEventDelta: (session?.lastEvent?.ts?.fired) ? body.event.ts.fired - session.lastEvent.ts.fired : null
                },
                type: body.event.type,
                payload: eventType !== 'page-view' ? body.event.payload : {}
            },
            device: {
                os: parsedUserAgent.os,
                cpu: parsedUserAgent.cpu,
                ...parsedUserAgent.device,
                ...body.device
            },
            browser: {
                engine: parsedUserAgent.engine,
                ...parsedUserAgent.browser,
                ...body.browser
            },
            userAgent: req.headers['user-agent'],
            session: {
                _id: session.id,
                isNewUser: session.events === 1, // @TODO revise
                views: session.views,
                events: session.events,
                lastEvent: session?.lastEvent
            },
            ip: metrics.ip(req),
            serverSide: body.serverSide
        };

        session.lastEvent = {
            _id: data.event._id,
            ts: body.event.ts,
            type: body.event.type
        };

        await redisClient.rPush(process.env.TRACKING_KEY, JSON.stringify(data));

        res.json({ status: 'success', event_id: data.event._id });
    } catch (err) {
        next(err);
    }
}