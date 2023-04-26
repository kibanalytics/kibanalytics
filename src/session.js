const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redis-session-client');
const cookieOptions = require('./cookie-options');

module.exports = session({
    name: `${process.env.EXPRESS_COOKIE_NAME}_session`,
    secret: process.env.EXPRESS_SECRET,
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    resave: false,
    genid: () => uuidv4(),
    cookie: {
        ...cookieOptions,
        maxAge: process.env.EXPRESS_SESSION_MAX_AGE
            ? +process.env.EXPRESS_SESSION_MAX_AGE
            : 1800000 // 30 minutes
    }
});