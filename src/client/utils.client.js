'use strict';

const hook = (_this, method, callback) => {
    const orig = _this[method];

    return (...args) => {
        callback.apply(null, args);

        return orig.apply(_this, args);
    };
};

const adblockEnabled = () => {
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

const getClassPrefixRegExp = (prefix) => {
    return new RegExp(`^${prefix}-([a-z]+)-([\\w]+[\\w-]*)$`);
}

const getEventClassSelector = (prefix) => `[class*=\'${prefix}-\']`;

export {
    hook,
    adblockEnabled,
    cookiesEnabled,
    getPrefixedAttributes,
    getClassPrefixRegExp,
    getEventClassSelector
};