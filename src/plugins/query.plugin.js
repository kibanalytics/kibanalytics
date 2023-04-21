const DEFAULT_KEYS = [
	'src',
	'utm_campaign',
	'utm_content',
	'utm_medium',
	'utm_source',
	'utm_term'
];
const USER_KEYS = process.env.EXPRESS_QUERY_KEYS?.split(',') ?? [];

module.exports = (req) => {
	const url = new URL(req.data.url.href);
	const keys = [...DEFAULT_KEYS, ...USER_KEYS];
	const query = {};

	for (const key of keys) {
		if (url.searchParams.has(key)) query[key] = url.searchParams.get(key);
	}

	req.data.url.query = query;
}