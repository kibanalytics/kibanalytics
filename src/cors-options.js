const allowedOrigins = process.env.EXPRESS_ALLOWED_ORIGINS
    .split(',')
    .map(v => new RegExp(v));

module.exports = {
    origin: allowedOrigins,
    credentials: true, // Enable HTTP cookies over CORS
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'OPTION']
};