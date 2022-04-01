(window => {
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

  const {
    screen: { width, height },
    navigator: { language },
    location: { hostname, pathname, search },
    localStorage,
    sessionStorage,
    document,
    history,
  } = window;

  const script = document.querySelector('script[data-website-id]');

  if (!script) return;

  const attr = script.getAttribute.bind(script);
  const website = attr('data-website-id');
  const hostUrl = attr('data-host-url');
  const autoTrack = attr('data-auto-track') !== 'false';
  const dnt = attr('data-do-not-track');
  const useCache = attr('data-cache');
  const cssEvents = attr('data-css-events') !== 'false';
  const domain = attr('data-domains') || '';
  const domains = domain.split(',').map(n => n.trim());
  const serverSide = attr('data-server-side') || {};

  const eventClass = /^kibanalytics--([a-z]+)--([\w]+[\w-]*)$/;
  const eventSelect = "[class*='kibanalytics--']";
  const cacheKey = 'kibanalytics.cache';

  const trackingDisabled = () =>
    (localStorage && localStorage.getItem('kibanalytics.disabled')) ||
    (dnt && doNotTrack()) ||
    (domain && !domains.includes(hostname));

  const root = hostUrl
    ? removeTrailingSlash(hostUrl)
    : script.src.split('/').slice(0, -1).join('/');
  const screen = `${width}x${height}`;
  const listeners = {};
  let currentUrl = `${pathname}${search}`;
  let currentRef = document.referrer;

  /* Collect metrics */

  const post = (url, data, callback) => {
    const req = new XMLHttpRequest();
    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.withCredentials = true; // Send cookies

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        callback(req.response);
      }
    };

    console.log(data);
    req.send(JSON.stringify({ ...data, serverSide }));
  };

  // @TODO check cache payload
  const getPayload = () => ({
    website,
    hostname,
    screen,
    language,
    // cache: useCache && sessionStorage.getItem(cacheKey),
    url: currentUrl,
  });

  const assign = (a, b) => {
    Object.keys(b).forEach(key => {
      a[key] = b[key];
    });
    return a;
  };

  const collect = (type, payload) => {
    if (trackingDisabled()) return;

    post(
      `${root}/collect`,
      {
        type,
        payload,
      },
      res => useCache && sessionStorage.setItem(cacheKey, res),
    );
  };

  const trackView = (url = currentUrl, referrer = currentRef, uuid = website) => {
    collect(
      'pageview',
      assign(getPayload(), {
        website: uuid,
        url,
        referrer,
      }),
    );
  };

  const trackEvent = (event_value, event_type = 'custom', url = currentUrl, uuid = website) => {
    collect(
      'event',
      assign(getPayload(), {
        website: uuid,
        url,
        event_type,
        event_value,
      }),
    );
  };

  /* Handle events */

  const sendEvent = (value, type) => {
    const payload = getPayload();

    payload.event_type = type;
    payload.event_value = value;

    const data = JSON.stringify({
      type: 'event',
      payload,
    });

    navigator.sendBeacon(`${root}/collect`, data);
  };

  const addEvents = node => {
    const elements = node.querySelectorAll(eventSelect);
    Array.prototype.forEach.call(elements, addEvent);
  };

  const addEvent = element => {
    (element.getAttribute('class') || '').split(' ').forEach(className => {
      if (!eventClass.test(className)) return;

      const [, type, value] = className.split('--');
      const listener = listeners[className]
        ? listeners[className]
        : (listeners[className] = () => {
            if (element.tagName === 'A') {
              sendEvent(value, type);
            } else {
              trackEvent(value, type);
            }
          });

      element.addEventListener(type, listener, true);
    });
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
      trackView();
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
    const kibanalytics = eventValue => trackEvent(eventValue);
    kibanalytics.trackView = trackView;
    kibanalytics.trackEvent = trackEvent;

    window.kibanalytics = kibanalytics;
  }

  /* Start */

  if (autoTrack && !trackingDisabled()) {
    history.pushState = hook(history, 'pushState', handlePush);
    history.replaceState = hook(history, 'replaceState', handlePush);

    const update = () => {
      if (document.readyState === 'complete') {
        trackView();

        if (cssEvents) {
          addEvents(document);
          observeDocument();
        }
      }
    };

    document.addEventListener('readystatechange', update, true);

    update();
  }
})(window);

/*
let boe = document.getElementsByTagName('body')[0], ade;
if (boe) {
    ade = document.createElement('div');
    ade.setAttribute('class', "ads ad adsbox doubleclick ad-placement carbon-ads");
    ade.setAttribute('style', "height:1px;width:1px;position: absolute;left:-999px;top:-999px;");
    ade.textContent = "&nbsp;";
    boe.appendChild(ade);
}

console.log({
    "adblock": ade.offsetHeight === 0 ? 1 : 0,
    "cookies": (navigator && navigator.cookieEnabled) || !!document.cookie ? 1 : 0
});
 */