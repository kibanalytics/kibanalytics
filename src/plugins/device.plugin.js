const uaParser = require('ua-parser-js');

module.exports = (req) => {
    const { body } = req;
    const parsedUserAgent = uaParser(req.headers['user-agent']);

    req.data.device = {
        os: parsedUserAgent.os,
        cpu: parsedUserAgent.cpu,
        ...parsedUserAgent.device,
        type: parsedUserAgent.device.type ?? 'desktop', // Default empty device type to 'desktop'
        ...body.device
    };
};