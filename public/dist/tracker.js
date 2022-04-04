/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/utils.client.js":
/*!************************************!*\
  !*** ./src/client/utils.client.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "adBlockEnabled": () => (/* binding */ adBlockEnabled),
/* harmony export */   "cookiesEnabled": () => (/* binding */ cookiesEnabled),
/* harmony export */   "doNotTrack": () => (/* binding */ doNotTrack),
/* harmony export */   "hook": () => (/* binding */ hook)
/* harmony export */ });
const hook = (_this, method, callback) => {
    const orig = _this[method];

    return (...args) => {
        callback.apply(null, args);

        return orig.apply(_this, args);
    };
};

const doNotTrack = () => {
    const { doNotTrack, navigator, external } = window;

    const msTrackProtection = 'msTrackingProtectionEnabled';
    const msTracking = () => {
        return external && msTrackProtection in external && external[msTrackProtection]();
    };

    const dnt = doNotTrack || navigator.doNotTrack || navigator.msDoNotTrack || msTracking();

    return dnt == '1' || dnt === 'yes';
};

const adBlockEnabled = () => {
    let ade;
    const boe = document.getElementsByTagName('body')[0];

    if (boe) {
        ade = document.createElement('div');
        ade.setAttribute('class', 'ads ad adsbox doubleclick ad-placement carbon-ads');
        ade.setAttribute('style', 'height:1px;width:1px;position: absolute;left:-999px;top:-999px;');
        ade.textContent = '&nbsp;';
        boe.appendChild(ade);
    }

    return !!ade && ade.offsetHeight === 0;
}

const cookiesEnabled = (navigator && navigator.cookieEnabled) || !!document.cookie;



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************************!*\
  !*** ./src/client/tracker.client.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_client_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.client.js */ "./src/client/utils.client.js");


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

    const metrics = attr('data-metrics') ? JSON.parse(attr('data-metrics')) : {};

    const eventClass = /^kibanalytics--([a-z]+)--([\w]+[\w-]*)$/;
    const eventSelector = '[class*=\'kibanalytics--\']';
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
        adBlock: (0,_utils_client_js__WEBPACK_IMPORTED_MODULE_0__.adBlockEnabled)(),
        cookies: _utils_client_js__WEBPACK_IMPORTED_MODULE_0__.cookiesEnabled
    });

    const collect = (type, payload, sendBeacon = false) => {
        if ((0,_utils_client_js__WEBPACK_IMPORTED_MODULE_0__.doNotTrack)()) return;

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
            return navigator.sendBeacon(url, JSON.stringify(body));
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

    const trackEvent = (type = 'custom', data = {}, element = null) => {
        const sendBeacon = element ? element.tagName === 'A' : false;

        const payload = (type === 'page-view' && !element)
            ? getPageViewPayload()
            : { ...getDefaultPayload(), data };

        collect(type, payload, sendBeacon);
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

            const [prefix, type, value] = className.split('--');
            let listener = listeners[className];
            if (!listener) {
                listener = listeners[className] ? listeners[className] : () => trackEvent(type, value, element);
                listeners[className] = listener
            }

            element.addEventListener(type, listener, true);
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
            trackEvent('pageView');
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

    if (!window.kibanalytics) {
        window.kibanalytics = {
            trackEvent
        };
    }

    /* Start */

    if (!(0,_utils_client_js__WEBPACK_IMPORTED_MODULE_0__.doNotTrack)()) {
        history.pushState = (0,_utils_client_js__WEBPACK_IMPORTED_MODULE_0__.hook)(history, 'pushState', handlePush);
        history.replaceState = (0,_utils_client_js__WEBPACK_IMPORTED_MODULE_0__.hook)(history, 'replaceState', handlePush);

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
})();

/******/ })()
;
//# sourceMappingURL=tracker.js.map