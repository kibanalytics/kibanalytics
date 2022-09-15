const allowedOrigins = process.env.EXPRESS_ALLOWED_ORIGINS
    .split(',')
    .map(v => new RegExp(v));

if (allowedOrigins.find(origin => origin === '*'))
    throw new Error(`Invalid origin '*'. Credentials not supported if the CORS header 'Access-Control-Allow-Origin' is '*'.`);

module.exports = {
    origin: allowedOrigins,
    credentials: true, // Enable HTTP cookies over CORS
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'OPTION']
};