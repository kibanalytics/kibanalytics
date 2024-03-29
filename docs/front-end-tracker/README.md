# Front-End Tracker Library

To start tracking events, it's mandatory to load the front-end KBS tracker library.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    <script src="kbs.js"></script>
    ...
</head>
<body>
...
</body>
</html>
```

Those are the possible configuration properties to the script tag:

| Name            |  Type   |                                                                 Description |
|:----------------|:-------:|----------------------------------------------------------------------------:|
| data-server-url | string  | Sets the URL of Kibanalytics server endpoint. <br/> Defaults to '/collect'. |
| data-auto-track | boolean |    Enable or disable page view events auto track. <br/> Enabled by default. |
| data-css-prefix | string  |         CSS prefix for class based event tracking. <br/> Defaults to 'kbs'. |

Another way to set the server url is by setting the value of 'serverSideData' property of the kbs global object.

```javascript
kbs.serverUrl = 'https://mywebsite.com/collect';
```

## Event Tracking

By default, Kibanalytics will track page view events. A new page view event is dispatched every time the state property
from the [history](https://developer.mozilla.org/en-US/docs/Web/API/History) web API changes.
Simply put, this happens every time the user navigates to a new URL. 

It's possible to change this behaivor by setting the 'data-auto-track' kbs script html
attribute value to 'false'.

Also, it's possible to track a [event](https://developer.mozilla.org/en-US/docs/Web/Events) from a DOM [element](https://developer.mozilla.org/en-US/docs/Web/API/Element) object.
There are two ways to track DOM element events in Kibanalytics: using JavaScript or CSS classes.

### JavaScript Event Tracking

```html
<button id="myButton">Click Here</button>
...
```

```javascript
const { kbs } = window;

// CSS Selector
const selector = '#myButton';

// Any DOM element event
const type = 'click';

// Data param (optional) can be any JSON object
const data = {
    foo: 'bar'
};

kbs.trackEvent(selector, type, data);
```

Optionally it's possible to use a custom label to the event type.

```javascript
const label = 'myButtonClick';

kbs.trackEvent(selector, type, data, label);
```

### JavaScript Event List Tracking

Track events from an array. Useful to add multiple events at once.

```html
<button id="button01">Button 01</button>
<button id="button02">Button 02</button>
<button id="button03">Button 03</button>
...
```

```javascript
const { kbs } = window;

// Array of events
const eventList = [{
    selector: '#button01',
    type: 'click',
    data: {
        id: 'button01',
        foo: 'bar'
    }
}, {
    selector: '#button02',
    type: 'click',
    data: {
        id: 'button02',
        foo: 'bar'
    }
}, {
    selector: '#button03',
    type: 'click',
    label: 'button03Click',
    data: {
        id: 'button03',
        foo: 'bar'
    }
}];

kbs.trackEventList(eventList);
```

Optionally it's possible to load the event list from a remote JSON file.

```javascript
const eventListUrl = 'https://mywebsite.com/event-list.json';

kbs.trackEventListUrl(eventListUrl)
    .then(() => console.log('eventListUrl loaded.'));
```

### Custom JavaScript Events

To programmatically dispatch a custom event, use the 'track' function from kbs global object.

```javascript
const { kbs } = window;

// Type param can be any string to describe the event
const type = 'customEvent1';

// Data param (optional) can be any JSON object
const data = {
    foo: 'bar'
};

kbs.track(type, data).then(response => {
    const { status, event_id } = response;
    console.log(status, event_id);
    /*
        'success', 'dcfe7e64-49f9-477a-b4da-3f82ebb8e3a5'
     */
});
```

### CSS Class Event Tracking

It's possible to track events by simply adding a special prefixed CSS class to the element you want to track and
the dispatched event by the element.

The CSS class sintax uses the follow pattern: {{prefix}}-{{event}}-{{custom-id}}.

```html
<button class="kbs-click-button01">Button 01</button>
```

By default, the CSS class prefix is defined to 'kbs', but it could be changed by the 'data-css-prefix' kbs script html 
attribute value:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    <script src="kbs.js" data-css-prefix="myCustomPrefix"></script>
    ...
</head>
<body>
<button class="myCustomPrefix-click-button01">Button 01</button>
...
</body>
</html>
```

Also, it's possible to change the CSS class prefix with JavaScript:

```javascript
kbs.eventClassPrefix = 'myCustomPrefix';
```

## Server-Side Custom Data

To add custom data to all tracked events (for example, server side generated data),
set a custom object to the 'serverSideData' property of the kbs global object.

```javascript
kbs.serverSideData = { foo: 'bar' };
```

## Global Callback

To add a custom global callback to be called every time a event is tracked,
set a custom function to the 'callback' property of the kbs global object.

```javascript
kbs.callback = (response) => {
    const { status, event_id } = response;
    console.log(status, event_id);
    /*
        'success', 'dcfe7e64-49f9-477a-b4da-3f82ebb8e3a5'
     */
};
```

## API Reference

```javascript
const kbs = {
    /**
     * Get Kibanalytics server URL
     * @return {string}
     */
    get serverUrl() {},

    /**
     * Set Kibanalytics server URL
     * @param {string} url
     * @return {string} - Server URL
     */
    set serverUrl(url) {},

    /**
     * Get server-side custom data
     * @return {Object}
     */
    get serverSideData() {},

    /**
     * Set server-side custom data
     * @param {Object} obj
     * @return {Object} - Server-side data
     */
    set serverSideData(obj) {},

    /**
     * Get event class prefix
     * @return {string}
     */
    get eventClassPrefix() {},

    /**
     * Set event class prefix
     * @param {string} prefix
     * @return {string} - Event class prefix
     */
    set eventClassPrefix(prefix) {},

    /**
     * @callback callback
     * 
     * Get callback function
     * @return {callback}
     */
    get callback() {},

    /**
     * @callback callback
     *
     * Set callback function
     * @param {callback} fn
     * @return {callback}
     */
    set callback(fn) {},

    /**
     * Get last tracked event data
     * @return {Object} - Object with event data
     */
    lastEvent() {},

    /**
     * Track custom events
     * @param {string} type - Event type
     * @param {Object} data - Any custom data
     * @return {Object} - Object with requisition status and event id
     */
    track(type, data) {},

    /**
     * @typedef {{ select: string, type: string, data: Object, label?: string }} Event
     * 
     * Track a event from a DOM element object.
     * @param {Event} event - Event
     * @return {Void}
     */
    trackEvent(event) {},

    /**
     * @typedef {{ select: string, type: string, data: Object, label?: string }} Event
     * @typedef {Event[]} EventList
     *
     * Track a list of events from DOM element objects.
     * @param {EventList} event - Event list
     * @return {Void}
     */
    trackEventList(list) {},

    /**
     * Track a remote list of event from a DOM element object.
     * @param {string} url - URL for the JSON file with the list of events
     * @return {Void}
     */
    trackEventListUrl(url) {}
};
```