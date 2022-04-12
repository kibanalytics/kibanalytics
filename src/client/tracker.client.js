'use strict';

import classListener from './class-listener.client';
import { adBlockEnabled, cookiesEnabled, doNotTrack, hook } from './utils.client.js';

(window => {
    const pageStartTs = (new Date()).getTime();

    const {
        screen,
        navigator: { language, platform },
        location,
        document,
        history,
    } = window;

    const script = document.querySelector('script[data-tracker-id]');
    if (!script) throw new Error('data-tracker-id not found');

    const attr = script.getAttribute.bind(script);
    const tracker_id = attr('data-tracker-id');
    const serverUrl = attr('data-server-url') || `${location.origin}/collect`;

    const eventClass = /^kbs-([a-z]+)-([\w]+[\w-]*)$/;
    const eventSelector = '[class*=\'kbs-\']';
    const listeners = {};
    let currentUrl = location.href;
    let currentRef = document.referrer;
    let callback = null;
    let serverSideData = {};

    /* Collect metrics */

    const collect = async (type, payload, sendBeacon = false) => {
        if (doNotTrack()) return;
        const eventTs = (new Date()).getTime();

        const url = `${serverUrl}`;
        const body = {
            tracker_id,
            url: {
                href: currentUrl,
                referrer: currentRef
            },
            event: {
                ts: {
                    pageStart: pageStartTs,
                    fired: eventTs,
                    pageStartFiredDelta: eventTs - pageStartTs
                },
                type,
                payload
            },
            device: {
                platform,
                screen: {
                    width: screen.width,
                    height: screen.height
                }
            },
            browser: {
                language,
                adBlock: adBlockEnabled(),
                cookies: cookiesEnabled
            },
            serverSide: serverSideData
        };

        if (sendBeacon) {
            /*
                A problem with sending analytics is that a site often wants to send analytics when the user
                has finished with a page: for example, when the user navigates to another page. In this situation
                the browser may be about to unload the page, and in that case the browser may choose not to send
                asynchronous XMLHttpRequest requests.
             */

            const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
            const queued = navigator.sendBeacon(url, blob);

            /*
                The sendBeacon() method returns true if the user agent successfully queued the data for transfer.
                Otherwise, it returns false.
             */

            return (queued)
                ? { status: 'success', event_id: 'sendBeacon' }
                : { status: 'error', message: 'User agent failed to queue the data transfer' };
        }

        return await fetch(url, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        }).then(response => response.json());
    };

    const trackEvent = async (type = 'custom', data = {}, options = {}) => {
        const response = await collect(type, data, options.sendBeacon);

        if (callback) callback(response);
        return response;
    };

    /* Handle events */

    const addEvents = node => {
        const elements = node.querySelectorAll(eventSelector);
        Array.prototype.forEach.call(elements, addEvent);
    };

    const addEvent = element => {
        const classes = element.getAttribute('class')?.split(' ');
        if (!classes) return;

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
        currentUrl = location.href;

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

    // @TODO Referal Host
    // @TODO new user or not

    /* Global */

    const kbs = {
        get serverSideData() {
            return serverSideData
        },
        set serverSideData(obj) {
            if (typeof obj === 'object') serverSideData = obj;
        },
        get callback() {
            return callback;
        },
        set callback(fn) {
            if (typeof fn === 'function') callback = fn;
            return callback;
        },
        trackEvent
    };
    Object.freeze(kbs);

    if (!window.kbs) {
        window.kbs = kbs;
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