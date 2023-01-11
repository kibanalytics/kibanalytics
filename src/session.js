const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redis-session-client');

const expressSessionCookieSameSite = process.env.EXPRESS_SESSION_COOKIE_SAME_SITE.toLowerCase();

let sameSite;
if (['lax', 'none', 'strict'].includes(expressSessionCookieSameSite)) {
    sameSite = process.env.EXPRESS_SESSION_COOKIE_SAME_SITE
} else sameSite = expressSessionCookieSameSite !== '0';

module.exports = session({
    name: process.env.EXPRESS_SESSION_NAME,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    resave: false,
    genid: () => uuidv4(),
    cookie: {
        /*
            Cookies will be sent in all contexts, i.e. in responses to both first-party and cross-origin requests.
            If SameSite=None is set, the cookie Secure attribute must also be set (or the cookie will be blocked).
        */
        sameSite,
        httpOnly: true,
        secure: !!+process.env.EXPRESS_SESSION_COOKIE_SECURE,
        maxAge: process.env.EXPRESS_SESSION_COOKIE_MAX_AGE
            ? parseInt(process.env.EXPRESS_SESSION_COOKIE_MAX_AGE)
            : 7776000000 // default to 90d
    }
});