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

// @TODO Needs testing

module.exports = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
    credentials: true // Enable HTTP cookies over CORS
};