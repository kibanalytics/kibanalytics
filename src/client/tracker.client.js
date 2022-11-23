'use strict';

import classListener from './class-listener.client';
import {
    adBlockEnabled,
    cookiesEnabled,
    hook,
    getClassPrefixRegExp,
    getEventClassSelector
} from './utils.client.js';

(window => {
    const scriptStartedTs = (new Date()).getTime();

    const {
        screen,
        navigator: { language, platform },
        location,
        document,
        history,
    } = window;

    /*
        Does not work with modules <script type="module">
        if we change this script to a module on the future
     */
    const script = document.currentScript;

    const attr = script.getAttribute.bind(script);
    const listeners = new Map();

    let serverUrl = attr('data-server-url') || `${location.origin}/collect`; // default value
    let autoTrack = attr('data-auto-track') !== 'false';
    let eventClassPrefix = attr('data-css-prefix') || 'kbs'; // default value
    let serverSideData = {};
    let eventClassRegex = getClassPrefixRegExp(eventClassPrefix);
    let eventClassSelector = getEventClassSelector(eventClassPrefix);
    let callback = null;
    let currentUrl = location.href;
    let currentRef = document.referrer;
    let lastEvent = null;

    /* Collect metrics */

    const collect = async (type, payload, sendBeacon = false) => {
        const eventTs = (new Date()).getTime();

        const url = serverUrl;
        const body = {
            url: {
                href: currentUrl
            },
            referrer: currentRef,
            event: {
                ts: {
                    scriptStarted: scriptStartedTs,
                    started: eventTs,
                    scriptEventStartedDelta: eventTs - scriptStartedTs
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

        const response = await fetch(url, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        const json = response.ok ? await response.json() : null;

        lastEvent = {
            data: body,
            response: {
                statusCode: response.status,
                data: json
            }
        };

        return lastEvent;
    };

    /* Handle events */

    const track = async (type = 'custom', data = {}, options = {}) => {
        const response = await collect(type, data, options.sendBeacon);

        if (callback) callback(response);
        return response;
    };

    // @TODO keeps the reference, allow a public method to remove the event listner
    const trackEvent = ({ selector, type, data, label }) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Element witg selector ${selector} not found.`);

        element.addEventListener(type, () => track(label ?? type, data), true);
    };

    const trackEventList = (list) => {
        for (const event of list) {
            trackEvent(event);
        }
    };

    const trackEventListUrl = async (url) => {
        const list = await fetch(url, {
            method: 'get',
            headers: {
                'content-type': 'application/json'
            }
        }).then(response => response.json());

        trackEventList(list);
    };

    /* Handle class events */

    const addClassEvents = node => {
        const elements = node.querySelectorAll(eventClassSelector);
        Array.prototype.forEach.call(elements, addClassEvent);
    };

    const removeClassEvents = node => {
        const elements = node.querySelectorAll(eventClassSelector);
        Array.prototype.forEach.call(elements, removeClassEvent);
    };

    const addClassEvent = element => {
        const classes = element.getAttribute('class')?.split(' ');
        if (!classes) return;

        for (const className of classes) {
            if (!eventClassRegex.test(className)) continue;

            const [prefix, type, value] = className.split('-');
            if (!listeners.has(className)) listeners.set(className, classListener(element, className, prefix, type, value, track));

            element.addEventListener(type, listeners.get(className), true);
        }
    };

    const removeClassEvent = element => {
        const classes = element.getAttribute('class')?.split(' ');
        if (!classes) return;

        for (const className of classes) {
            const type = className.split('-')[1];

            element.removeEventListener(type, listeners.get(className), true);
            listeners.delete(className);
        }
    };

    /* Handle history changes */

    const handlePush = (state, title, url) => {
        if (!url) return;

        currentRef = currentUrl;
        currentUrl = location.href;

        if (currentUrl !== currentRef) {
            track('pageview');
        }
    };

    const observeDocument = () => {
        const monitorMutate = mutations => {
            mutations.forEach(mutation => {
                const element = mutation.target;
                addClassEvent(element);
                addClassEvents(element);
            });
        };

        const observer = new MutationObserver(monitorMutate);
        observer.observe(document, { childList: true, subtree: true });
    };

    // @TODO Referal Host

    /* Global */

    // @TODO function to set all configurations at once
    // @TODO maybe transform this object to a JavaScript class
    // @TODO delay inicialization by html property, allowing initialization by JavaScript

    const kbs = {
        get serverUrl() {
            return serverUrl;
        },
        set serverUrl(url) {
            serverUrl = url;
            return serverUrl;
        },
        get serverSideData() {
            return serverSideData
        },
        set serverSideData(obj) {
            serverSideData = (typeof obj === 'object') ? obj : {};
        },
        get eventClassPrefix() {
            return eventClassPrefix;
        },
        set eventClassPrefix(prefix) {
            removeClassEvents(document);

            eventClassPrefix = prefix;
            eventClassRegex = getClassPrefixRegExp(prefix);
            eventClassSelector = getEventClassSelector(prefix);
            addClassEvents(document);

            return eventClassPrefix;
        },
        get callback() {
            return callback;
        },
        set callback(fn) {
            callback = (typeof fn === 'function') ? fn : null;
            return callback;
        },
        get lastEvent() {
            return lastEvent;
        },
        track,
        trackEvent,
        trackEventList,
        trackEventListUrl
    };
    Object.freeze(kbs);

    if (!window.kbs) {
        window.kbs = kbs;
    }

    /* Start */

    history.pushState = hook(history, 'pushState', handlePush);
    history.replaceState = hook(history, 'replaceState', handlePush);

    const update = () => {
        if (document.readyState === 'complete') {
            if (autoTrack) track('pageview');
            addClassEvents(document);
            observeDocument();
        }
    };

    document.addEventListener('readystatechange', update, true);
    update();
})(window);