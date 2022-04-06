'use strict';

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

export {
    hook,
    doNotTrack,
    adBlockEnabled,
    cookiesEnabled,
    getPrefixedAttributes,
    isJsonString
};