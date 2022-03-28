# kibanalytics

The goal of this project is to create an ELK stack based analytical tool for website users just like Google Analytics,
with an opportunity to have ownership of collected data and extend the collected datasets as wanted



## Client side

A client side script can be embedded in a webpage using `<script>` tags, inline or via `src` attributes.
The client goal is to collect events, both user-generated and browser generated, send them to an endpoint via a POST request, with a json-encoded payload.

The collected data is the result of a merge of server generated data (any kind of dataset that the server decides to track) plus client generated data.

Ideally, the script would be called in the form of:

`<script type="text/javascript" data-server-side="{ \"from_server\": 1 }" src="//some.host/tracker.js"></script>`

As reference: https://github.com/mikecao/umami/blob/master/tracker/index.js


client side would push events merging the json object contained in `data-server-side` to the object event itself.


## Server side

Server side goal is to receive POST requests, integrating the received data payload with session data, generate a final json object and push it to a redis instance queue, returning an event-id as response.


The session managment should be cross accessible with an in-memory storage (redis fits perfectly) because the session should be accessible from 3rd-party softwares.


Server can be hosted anywhere but ideally there would be configurable CORS options in order to allow cross site data pushing.
Cookie domain can also be optionally configurable to be subdomain valid.

A test case:
having your website on www.example.com and kibanalytics on tracking.example.com, the cookie domain allowance should be set to `*.example.com`

### Data validation (VALIDATE_JSON_SCHEMA=true)
in order to prevent abuse, incoming data could be validated with a json schema validator



### Resources
// Adblock detector
let boe = document.getElementsByTagName('body')[0], ade;
if (boe) {
    ade = document.createElement('div');
    ade.setAttribute('class', "ads ad adsbox doubleclick ad-placement carbon-ads");
    ade.setAttribute('style', "height:1px;width:1px;position: absolute;left:-999px;top:-999px;");
    ade.textContent = "&nbsp;";
    boe.appendChild(ade);
}
let adblock = ade.offsetHeight === 0 ? 1 : 0

// Cookie enabled check
(navigator && navigator.cookieEnabled) || !!document.cookie ? 1 : 0


// Navigation
window.addEventListener('beforeunload', (event) => {
    this.leave()
});


// Event sending
let xhr = new XMLHttpRequest();
xhr.open('POST', this.endpoint, true);
xhr.setRequestHeader('Content-type', 'application/json');
xhr.timeout = 10000;
if (typeof cb === 'function') {
    cb = [ cb ]
}
if (!!cb) {
    for (let callable in cb) {
        callable = cb[callable];
        if (!!callable) {
            'load,error,abort,timeout'.split(',').forEach(ev =>  xhr.addEventListener(ev, callable.bind(this) ) );
        }
    }
}
xhr.send(JSON.stringify({
    delta: parseInt(((1*new Date()) - this.local.t)/1000),
    page: this.page,
    local: this.local,
    event: event
}));
