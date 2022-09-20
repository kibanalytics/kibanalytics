const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redis-session-client');

const store = new RedisStore({ client: redisClient });

const getSessionById = (_id) => {
    return new Promise((resolve, reject) => {
        store.get(_id, (err, session) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(session);
        });
    });
};

const updateSessionById = (_id, session) => {
    return new Promise((resolve, reject) => {
        store.set(_id, session, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

const touchSessionById = (_id, session) => {
    return new Promise((resolve, reject) => {
        store.touch(_id, session, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

const destroySessionById = (_id, session) => {
    return new Promise((resolve, reject) => {
        store.touch(_id, session, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

module.exports = {
    store,
    getSessionById,
    updateSessionById,
    touchSessionById,
    destroySessionById
};