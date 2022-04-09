const allowedOrigins = process.env.EXPRESS_ALLOWED_ORIGINS
    .split(',')
    .map(v => {
        if (v.startsWith('*.')) {
            /*
                Input string *.example.com
                Output regex /\.example\.com$/
             */
            const regexString = v
                .trim()
                .replace('*', '')
                .replaceAll('.', '\\\.') + '$';

            return new RegExp(regexString);
        }
        return v;
    });

if (allowedOrigins.find(origin => origin === '*'))
    throw new Error(`Invalid origin '*'. Credentials not supported if the CORS header 'Access-Control-Allow-Origin' is '*'.`);

module.exports = {
    // origin: allowedOrigins,
    origin: "*", // @TODO - testing
    credentials: true, // Enable HTTP cookies over CORS
    optionsSuccessStatus: 200,
    methods: ['POST', 'OPTION']
};