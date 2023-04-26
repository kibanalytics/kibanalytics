const os = require('os');
const path = require('path');
const fs = require('fs/promises');
const util = require('util');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const redisClient = require('./redis-queue-client');
const validator = require('./validator');
const validateCollectEndpoint = validator.getSchema('collectEndpoint');
const plugins = require('./plugins');
const cookieOptions = require('./cookie-options');

const EVENT_FLOW_PAYLOAD_FIELDS = process.env.EXPRESS_EVENT_FLOW_PAYLOAD_FIELDS
		?.split(',')
		?.map(v => v.trim())
	|| [];
const USER_COOKIE_OPTIONS = {
    ...cookieOptions,
    maxAge: process.env.EXPRESS_USER_MAX_AGE
	    ? +process.env.EXPRESS_USER_MAX_AGE
	    : 31104000000 // default to 1y
};
const UPGRADE_FILE_NAME = '.UPGRADE';

const redisPing = util.promisify(redisClient.ping);

module.exports.collect = async (req, res, next) => {
	const eventTs = (new Date()).getTime();

	try {
		const { body } = req;
		body.event.ts.started = eventTs;

		if (!validateCollectEndpoint(body)) {
			res.status(422).json({
				status: 'error',
				message: 'Schema validation error',
				errors: validateCollectEndpoint.errors
			});
			return;
		}

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

		const { user, session } = req;

		/*
			If there's no 'events' property in sessions object, then it's a new session
		 */
		if (!session.events) {
			session.events = 0;
			session.eventsFlow = [];
			session.views = 0;
			session.viewsFlow = [];
			session.ts = {
				started: body.event.ts.started
			};

			/*
				New session, but the user is not new
			 */
			if (user.new && user.sessions > 0) {
				user.new = false;
			}

			user.sessions++;
		}

		const event = {
			_id: uuidv4(),
			type: body.event.type,
			ts: body.event.ts,
			payload: eventType !== 'pageview' ? body.event.payload : {}
		};

		session.eventsFlow.push({
			_id: event._id,
			href: body.url.href,
			type: event.type,
			ts: event.ts,
			payload: EVENT_FLOW_PAYLOAD_FIELDS.reduce((accumulator, path) => {
				const value = _.get(body.event.payload, path);
				if (value) _.set(accumulator, path, value);

				return accumulator;
			}, {})
		});

		user.events++;
		session.events++;

		if (eventType === 'pageview') {
			user.views++;
			session.views++;
			session.viewsFlow.push(body.url.href);
		}

		const url = new URL(body.url.href);
		const referrerUrl = body.referrer
			? new URL(body.referrer)
			: null;

		const data = {
			url: {
				href: body.url.href,
				hostname: url.hostname,
				path: url.pathname
			},
			referrer: {
				href: referrerUrl?.href ?? '',
				hostname: referrerUrl?.hostname ?? '',
				path: referrerUrl?.pathname ?? ''
			},
			event: event,
			userAgent: req.headers['user-agent'],
			user: user,
			session: {
				_id: session.id,
				events: session.events,
				eventsFlow: session.eventsFlow,
				lastEvent: session.lastEvent,
				views: session.views,
				viewsFlow: session.viewsFlow,
				ts: session.ts
			},
			serverSide: body.serverSide // @TODO maybe changing property name to custom ?
		};

		req.data = data; // data context reference for plugins
		for (const plugin of plugins) plugin(req);

		session.lastEvent = _.last(session.eventsFlow);
		await redisClient.rPush(process.env.REDIS_QUEUE_KEY, JSON.stringify(data));

		/*
			Storing the user data in the front-end with a cookie & hashed JWT token
		 */
        const signedUserToken = await jwt.sign(user, process.env.EXPRESS_SECRET);
        res.cookie(`${process.env.EXPRESS_COOKIE_NAME}_user`, signedUserToken, USER_COOKIE_OPTIONS);

		res.json({
			status: 'success',
			session: {
				_id: session._id
			},
			user: {
				_id: user._id
			},
			event: {
				_id: event._id,
				type: event.type,
				ts: event.ts
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