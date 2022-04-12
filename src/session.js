const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redis-client');

module.exports = session({
    name: process.env.EXPRESS_SESSION_ID,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: true,
    resave: false,
    cookie: {
        sameSite: 'lax',
        httpOnly: true,
        maxAge: 6.307e+11 // 20 years
    }
});