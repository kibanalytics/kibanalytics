const expressSessionCookieSameSite = process.env.EXPRESS_SESSION_COOKIE_SAME_SITE?.toLowerCase();
const sameSite = ['lax', 'none', 'strict'].includes(expressSessionCookieSameSite)
	? process.env.EXPRESS_SESSION_COOKIE_SAME_SITE
	: expressSessionCookieSameSite !== '0';

module.exports = {
	/*
		Cookies will be sent in all contexts, i.e. in responses to both first-party and cross-origin requests.
		If SameSite=None is set, the cookie Secure attribute must also be set (or the cookie will be blocked).
	*/
	sameSite,
	httpOnly: true,
	secure: !!+process.env.EXPRESS_SESSION_COOKIE_SECURE
};