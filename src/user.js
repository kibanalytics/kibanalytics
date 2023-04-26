const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const isBot = require('isbot');

module.exports = async (req, res, next) => {
	const user = req.cookies[`${process.env.EXPRESS_COOKIE_NAME}_user`];

	req.user = user
		? await jwt.verify(user, process.env.EXPRESS_SECRET)
		: {
			_id: uuidv4(),
			new: true,
			/*
				This aims to identify "Good bots". Those who voluntarily identify themselves by setting a unique,
				preferably descriptive, user agent, usually by setting a dedicated request header.
			 */
			bot: isBot(req.headers['user-agent']),
			sessions: 0,
			events: 0,
			views: 0
		};

	return next();
};