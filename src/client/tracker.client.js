import classListener from './class-listener.client';
import { adBlockEnabled, cookiesEnabled, doNotTrack, hook, getPrefixedAttributes } from './utils.client.js';

(window => {
    const {
        screen,
        navigator: { language, platform },
        location: { hostname, pathname, search },
        document,
        history,
    } = window;

    const script = document.querySelector('script');
    if (!script) return;

    const attr = script.getAttribute.bind(script);

    const tracker_id = attr('data-tracker-id');
    if (!tracker_id) throw new Error('data-tracker-id not found');

    const serverUrl = attr('data-server-url');
    if (!serverUrl) throw new Error('data-server-url not found');

    const metrics = getPrefixedAttributes('data-metrics-', script);

    const eventClass = /^kbs-([a-z]+)-([\w]+[\w-]*)$/;
    const eventSelector = '[class*=\'kbs-\']';
    const listeners = {};
    let currentUrl = `${pathname}${search}`;
    let currentRef = document.referrer;

    /* Collect metrics */

    const getDefaultPayload = () => ({
        tracker_id,
        hostname,
        url: currentUrl
    });

    const getPageViewPayload = () => ({
        ...getDefaultPayload(),
        referrer: currentRef,
        platform,
        screen: `${screen.width}x${screen.height}`,
        language,
        adBlock: adBlockEnabled(),
        cookies: cookiesEnabled
    });

    const collect = (type, payload, sendBeacon = false) => {
        if (doNotTrack()) return;

        const url = `${serverUrl}/collect`;
        const body = {
            type,
            metrics,
            payload
        }

        if (sendBeacon) {
            /*
                A problem with sending analytics is that a site often wants to send analytics when the user
                has finished with a page: for example, when the user navigates to another page. In this situation
                the browser may be about to unload the page, and in that case the browser may choose not to send
                asynchronous XMLHttpRequest requests.
             */

            const blob = new Blob([JSON.stringify(body)], { type : 'application/json' });
            return navigator.sendBeacon(url, blob);
        }

        return fetch(url, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });
    };

    const trackEvent = (type = 'custom', data = {}, options = {}) => {
        const payload = (type === 'page-view')
            ? getPageViewPayload()
            : { ...getDefaultPayload(), data };

        collect(type, payload, options.sendBeacon);
    };

    /* Handle events */

    const addEvents = node => {
        const elements = node.querySelectorAll(eventSelector);
        Array.prototype.forEach.call(elements, addEvent);
    };

    const addEvent = element => {
        const classes = element.getAttribute('class')?.split(' ');
        for (const className of classes) {
            if (!eventClass.test(className)) continue;

            const [prefix, type, value] = className.split('-');
            listeners[className] = listeners[className] || classListener(element, className, prefix, type, value, trackEvent);

            element.addEventListener(type, listeners[className], true);
        }
    };

    /* Handle history changes */

    const handlePush = (state, title, url) => {
        if (!url) return;

        currentRef = currentUrl;
        const newUrl = url.toString();

        if (newUrl.substring(0, 4) === 'http') {
            currentUrl = '/' + newUrl.split('/').splice(3).join('/');
        } else {
            currentUrl = newUrl;
        }

        if (currentUrl !== currentRef) {
            trackEvent('page-view');
        }
    };

    const observeDocument = () => {
        const monitorMutate = mutations => {
            mutations.forEach(mutation => {
                const element = mutation.target;
                addEvent(element);
                addEvents(element);
            });
        };

        const observer = new MutationObserver(monitorMutate);
        observer.observe(document, { childList: true, subtree: true });
    };

    /* Global */

    if (!window.kbs) {
        window.kbs = {
            trackEvent
        };
    }

    /* Start */

    if (!doNotTrack()) {
        history.pushState = hook(history, 'pushState', handlePush);
        history.replaceState = hook(history, 'replaceState', handlePush);

        const update = () => {
            if (document.readyState === 'complete') {
                trackEvent('page-view');
                addEvents(document);
                observeDocument();
            }
        };

        document.addEventListener('readystatechange', update, true);
        update();
    }
})(window);