const os = require('os');
const path = require('path');
const fs = require('fs/promises');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const isBot = require('isbot');

const redisClient = require('./redis-queue-client');
const validator = require('./validator');
const validateCollectEndpoint = validator.getSchema('collectEndpoint');
const plugins = require('./plugins');


/*
    @TODO Maybe is time to create a config.json file as .env file is starting to get to big
 */
const EVENT_FLOW_WITH_PAYLOAD = true; // @TODO make this configurable
const SESSION_DURATION = +process.env.EXPRESS_SESSION_DURATION || 1800000; // 30 minutes
const UPGRADE_FILE_NAME = '.UPGRADE';

const redisPing = util.promisify(redisClient.ping);

module.exports.collect = async (req, res, next) => {
    const eventTs = (new Date()).getTime();

    try {
        const { body } = req;
        body.event.ts.started = eventTs;

        // if (!validateCollectEndpoint(body)) {
        //     res.status(422).json({
        //         status: 'error',
        //         message: 'Schema validation error',
        //         errors: validateCollectEndpoint.errors
        //     });
        //     return;
        // }

        const eventType = body.event.type;

        if (!!+process.env.EXPRESS_VALIDATE_JSON_SCHEMA && eventType !== 'pageview') {
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

        if (req.session.user) {
            /*
                If user exists, we have a last event, then check the delta between the current event ts
                and the last event ts. If delta > SESSION_DURATION, generate a new session.
            */
            req.session.ts.currentLastEventStartedDelta = (req.session.lastEvent) ?
                body.event.ts.started - req.session.lastEvent.ts.started
                : null;

            if (req.session.ts.currentLastEventStartedDelta > SESSION_DURATION) {
                // Store user pointer to apply to regenerated session
                const user = req.session.user;
                user.new = false;

                // Promise version of session.regenerate fn
                const regenerate = () => new Promise((resolve, reject) => {
                    req.session.regenerate((err) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        // req.session properties cleared and new session.id created
                        resolve();
                    })
                });
                await regenerate();

                // Session regenerated keeping previous user information
                req.session.new = true;
                req.session.user = user;
                req.session.user.sessions++;
            } else {
                // Current session still valid
                req.session.new = false;
            }
        } else {
            // New user & session
            req.session.new = true;
            req.session.user = {
                _id: uuidv4(),
                new: true,
                /*
                    This aims to identify "Good bots". Those who voluntarily identify themselves by setting a unique,
                    preferably descriptive, user agent, usually by setting a dedicated request header.
                 */
                isBot: isBot(req.headers['user-agent']),
                sessions: 1,
                events: 0,
                views: 0
            };
        }

        if (req.session.new) {
            req.session.events = 0;
            req.session.eventsFlow = [];
            req.session.views = 0;
            req.session.viewsFlow = [];
            req.session.ts = {
                started: body.event.ts.scriptStarted
            };
        }

        // req.session pointer will not change anymore
        const { session } = req;

        const event = {
            _id: uuidv4(),
            type: body.event.type,
            ts: body.event.ts,
            payload: eventType !== 'pageview' ? body.event.payload : {}
        };
        session.user.events++;
        session.events++;
        session.eventsFlow.push({
            _id: event._id,
            href: body.url.href,
            type: event.type,
            ts: event.ts,
            payload: EVENT_FLOW_WITH_PAYLOAD ? event.payload : null
        });

        if (eventType === 'pageview') {
            session.user.views++;
            session.views++;
            session.viewsFlow.push(body.url.href);
        }

        const url = new URL(body.url.href);

        const data = {
            url: {
                hostname: url.hostname,
                pathname: url.pathname,
                search: url.search,
                hash: url.hash,
                ...body.url
            },
            referrer: body.referrer,
            event: event,
            userAgent: req.headers['user-agent'],
            user: session.user,
            session: {
                _id: session.id,
                new: session.new,
                events: session.events,
                eventsFlow: session.eventsFlow,
                lastEvent: session.lastEvent,
                views: session.views,
                viewsFlow: session.viewsFlow,
                ts: req.session.ts
            },
            serverSide: body.serverSide // @TODO maybe changing property name to custom ?
        };

        req.data = data; // data context reference for plugins
        for (const plugin of plugins) plugin(req);

        session.lastEvent = data.event;
        await redisClient.rPush(process.env.REDIS_QUEUE_KEY, JSON.stringify(data));

        res.json({
            status: 'success',
            session: {
                _id: data.session._id
            },
            user: {
                _id: data.user._id
            },
            event: {
                _id: data.event._id,
                type: event.type,
                ts: body.event.ts
            }
        });
    } catch (err) {
        next(err);
    }
}

exports.health = async (req, res, next) => {
    try {
        const hostname = os.hostname();

        const upgradeFilePath = path.join(process.cwd(), UPGRADE_FILE_NAME);
        const upgradeFileExists = await (async () => {
            try {
                await fs.access(upgradeFilePath);
                return true;
            } catch {
                return false;
            }
        })();

        const isRedisHealthy = await redisPing()
            .then(v => v === 'PONG')
            .catch(() => false);

        if (upgradeFileExists || !isRedisHealthy) {
            return res.status(410).json({
                status: 'error', data: {
                    hostname,
                    isRedisHealthy,
                    upgradeFileExists
                }
            });
        }

        return res.json({ status: 'ok', data: { hostname } });
    } catch (err) {
        return next(err);
    }
}