const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const { store } = require('./redis-store');

module.exports = session({
    name: process.env.EXPRESS_SESSION_ID,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store,
    saveUninitialized: true,
    resave: false,
    genid: () => uuidv4(),
    cookie: {
        /*
            Cookies will be sent in all contexts, i.e. in responses to both first-party and cross-origin requests.
            If SameSite=None is set, the cookie Secure attribute must also be set (or the cookie will be blocked).
        */
        sameSite: (process.env.NODE_ENV === 'production') ? 'none' : false,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt((process.env.EXPRESS_COOKIE_TTL || 7776000) * 1000) // defaulted to 90d
    }
});