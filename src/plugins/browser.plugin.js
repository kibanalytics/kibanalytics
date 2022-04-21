const uaParser = require('ua-parser-js');

module.exports = (req) => {
    const { body } = req;
    const parsedUserAgent = uaParser(req.headers['user-agent']);

    req.data.browser = {
        engine: parsedUserAgent.engine,
        ...parsedUserAgent.browser,
        ...body.browser
    };
};