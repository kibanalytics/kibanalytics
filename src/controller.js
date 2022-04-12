const { v4: uuidv4 } = require('uuid');
const redisClient = require('./redis-client');
const validator = require('./validator');
const uaParser = require('ua-parser-js');
const metrics = require('./metrics');
const validateCollectEndpoint = validator.getSchema('collectEndpoint');

const VISIT_DURATION = 30 * 60000; // 30 minutes

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

        if (session.events) {
            session.events++;
            session.lastEventDelta = body.event.ts.fired - session.lastEvent.ts.fired;
        } else {
            session.events = 1;
        }

        if (eventType === 'page-view') {
            if (session.views) {
                session.views++;
            } else {
                session.views = 1
            }
        }

        /*
            If visits counter exists, check the delta between the currently event ts and the last event ts.
            If delta > VISIT_DURATION, increase visits counter and set last visit ts.
         */
        if (session.visits) {
            session.lastEventVisitDelta = body.event.ts.fired - session.lastVisitTs;

            if (session.lastEventDelta > VISIT_DURATION) {
                session.lastVisitDuration = session.lastEventVisitDelta;
                session.lastVisitTs = body.event.ts.pageStart;
                session.visits++;
            }
        } else {
            session.visits = 1;
            session.firstVisitTs = session.lastVisitTs = body.event.ts.pageStart;
        }

        session.isNewUser = (session.visits === 1 && session.events === 1);

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
                ts: body.event.ts,
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
                isNewUser: session.isNewUser,
                visits: session.visits,
                firstVisitTs: session.firstVisitTs,
                lastVisitTs: session.lastVisitTs,
                lastVisitDuration: session.lastVisitDuration,
                views: session.views,
                events: session.events,
                lastEvent: session.lastEvent,
                lastEventDelta: session.lastEventDelta,
                lastEventVisitDelta: session.lastEventVisitDelta
            },
            ip: metrics.ip(req),
            serverSide: body.serverSide
        };

        session.lastEvent = body.event;

        await redisClient.rPush(process.env.TRACKING_KEY, JSON.stringify(data));

        res.json({ status: 'success', event_id: data.event._id });
    } catch (err) {
        next(err);
    }
}