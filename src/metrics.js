const { lookup } = require('geoip-lite');

module.exports.ip = (req) => {
    /*
        geoip-lite includes the GeoLite database from MaxMind. This database is not the most accurate database
        available, however it is the best available for free. You can use the commercial GeoIP database from
        MaxMind with better accuracy by buying a license from MaxMind, and then using the conversion utility to
        convert it to a format that geoip-lite understands. You will need to use the .csv files from MaxMind
        for conversion.
     */

    const address = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const ipData = lookup(address) || {};

    const ip = {
        address,
        ...ipData
    }

    /*
        If you are running in a local machine, you will not be able to get the location data. To test it out,
        just hardcode your IP address in the ip variable.
     */
    if (process.env.NODE_ENV === 'development') ip.address = '177.170.250.182';

    return ip;
}