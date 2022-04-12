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
        /*
            Cookies will be sent in all contexts, i.e. in responses to both first-party and cross-origin requests.
            If SameSite=None is set, the cookie Secure attribute must also be set (or the cookie will be blocked).
        */
        sameSite: (process.env.NODE_ENV === 'production') ? 'none' : false,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: process.env.COOKIE_TTL || 7776000 // defaulted to 90d
    }
});