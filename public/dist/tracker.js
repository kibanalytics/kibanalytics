/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/class-listener.client.js":
/*!*********************************************!*\
  !*** ./src/client/class-listener.client.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.client */ "./src/client/utils.client.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((element, className, prefix, type, value, trackEventFn) => () => {
    const classData = {
        name: className,
        prefix,
        type,
        value
    };

    const elementData = {
        tagName: element.tagName
    };

    const customData = (0,_utils_client__WEBPACK_IMPORTED_MODULE_0__.getPrefixedAttributes)('data-kbs-', element);

    const data = {
        class: classData,
        element: elementData,
        ...customData
    };

    const options = {
        sendBeacon: data.element.tagName === 'A'
    };
    return trackEventFn(type, data, options);
});

/***/ }),

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
/* harmony export */   "getPrefixedAttributes": () => (/* binding */ getPrefixedAttributes),
/* harmony export */   "hook": () => (/* binding */ hook),
/* harmony export */   "isJsonString": () => (/* binding */ isJsonString)
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

const getPrefixedAttributes = (attrPrefix, element) => {
    return element
        .getAttributeNames()
        .reduce((acc, name) => {
            if (name.startsWith(attrPrefix)) {
                const attrName = name.replace(attrPrefix, '');
                if (attrName) return { ...acc, [attrName]: element.getAttribute(name) }
            }
            return acc;
        }, {});
}

const isJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        console.warn('Invalid JSON string', str);
        return false;
    }
    return true;
}



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
/* harmony import */ var _class_listener_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./class-listener.client */ "./src/client/class-listener.client.js");
/* harmony import */ var _utils_client_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.client.js */ "./src/client/utils.client.js");





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
        if ((0,_utils_client_js__WEBPACK_IMPORTED_MODULE_1__.doNotTrack)()) return;
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
                adBlock: (0,_utils_client_js__WEBPACK_IMPORTED_MODULE_1__.adBlockEnabled)(),
                cookies: _utils_client_js__WEBPACK_IMPORTED_MODULE_1__.cookiesEnabled
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
            listeners[className] = listeners[className] || (0,_class_listener_client__WEBPACK_IMPORTED_MODULE_0__["default"])(element, className, prefix, type, value, trackEvent);

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

    if (!(0,_utils_client_js__WEBPACK_IMPORTED_MODULE_1__.doNotTrack)()) {
        history.pushState = (0,_utils_client_js__WEBPACK_IMPORTED_MODULE_1__.hook)(history, 'pushState', handlePush);
        history.replaceState = (0,_utils_client_js__WEBPACK_IMPORTED_MODULE_1__.hook)(history, 'replaceState', handlePush);

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