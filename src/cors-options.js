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

module.exports = {
    origin: allowedOrigins,
    credentials: true, // Enable HTTP cookies over CORS
    optionsSuccessStatus: 200,
    methods: ['POST']
};