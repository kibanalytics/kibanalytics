const crypto = require('crypto');
const { lookup } = require('geoip-lite');

module.exports = (req) => {
	/*
		geoip-lite includes the GeoLite database from MaxMind. This database is not the most accurate database
		available, however it is the best available for free. You can use the commercial GeoIP database from
		MaxMind with better accuracy by buying a license from MaxMind, and then using the conversion utility to
		convert it to a format that geoip-lite understands. You will need to use the .csv files from MaxMind
		for conversion.

		If running in a local machine, you will not be able to get the location data. To test it out,
		just hardcode your IP address in the ip variable.
	 */

	const address = process.env.NODE_ENV === 'development'
		? '177.170.250.182'
		: req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress
	const ipData = lookup(address) || {};

	// Convert '0' or '1' string to boolean value
	ipData.eu = ipData.eu === '1';

	/*
		Elasticsearch Geopoint Field Type
		Geopoint expressed as an array with the format: [lon, lat]

		geoip-lite, by default, provide coordinates as [lat, lon], so we have to reverse for
		Elasticsearch.
	 */
	ipData.ll = ipData?.ll?.reverse();

	/*
		To avoid conflict field issue in Elasticsearch
	 */
	if (!Array.isArray(ipData.range)) {
		delete ipData.range;
	}

	req.data.ip = {
		address,
		...ipData
	};

	if (!!process.env.EXPRESS_ANONYMIZE_USER_IP) {
		req.data.ip.address = crypto.createHash('md5').update(address).digest('hex');
	}
}