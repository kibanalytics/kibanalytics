# Output Schema

## Collected Data

This is the document structure to be saved in the database with all collect data for every dispatched event from the client.

```javascript
const CollectedData = {
    $id: '/schemas/collected-data',
    title: 'Collected Data',
    description: `Document with all collected data.`,
    properties: {
        url: { $ref: '/schemas/url' },
        referrer: {
            description: `The referer contains an absolute or partial address of the page 
                          that makes the request. The referer allows identify a page where 
                          the user are visiting it from`,
            type: 'string',
            example: 'https://www.virail.com/'
        },
        event: { $ref: '/schemas/event' },
        device: { $ref: '/schemas/device' },
        browser: { $ref: '/schemas/browser' },
        userAgent: {
            description: `User agent is any software, acting on behalf of a user, which 
                          "retrieves, renders and facilitates end-user interaction with Web content. 
                          This string contanins information about the application, operating system, 
                          vendor, and/or version of the requesting user agent".`,
            type: 'string',
            example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36 OPR/85.0.4341.60'
        },
        session: { $ref: '/schemas/session' },
        ip: { $ref: '/schemas/ip' },
        serverSide: { $ref: '/schemas/server-side' },
    },
    required: [
        'url',
        'referrer',
        'event',
        'device',
        'browser',
        'userAgent',
        'session',
        'ip',
        'serverSide'
    ],
    additionalProperties: false
};
```

## URL

URL stands for Uniform Resource Locator, colloquially termed as web address. A URL is the address of a given unique
resource on the Web. In theory, each valid URL points to a unique resource. Such resources can be an HTML page, a CSS
document, an image, etc.

```text
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┴──────────┴──────────┼────────────────────────┤          │                │       │
│                                   │         origin         │ pathname │     search     │ hash  │
├───────────────────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```
Source: [Node.js URL strings and URL objects](https://nodejs.org/api/url.html#url-strings-and-url-objects)

A URL string contains multiple meaningful components. When parsed, a URL object is returned
containing properties for each of these components.

```javascript
const Url = {
    $id: '/schemas/url',
    title: 'URL',
    description: `Group of properties parsed from a valid URL and .`,
    properties: {
        href: {
            description: `Hypertext reference is the whole URL.`,
            type: 'string',
            example: 'https://www.virail.com.ua/poezd-suchava-yassy'
        },
        hostname: {
            description: `Hostname is the domain name of the URL`,
            type: 'string',
            example: 'www.virail.com.ua'
        },
        pathname: {
            description: `Pathname is the part of the URL containing an initial '/' 
                          followed by the path of the URL not including the query string or fragment 
                          (or the empty string if there is no path).`,
            type: 'string',
            example: '/poezd-suchava-yassy'
        },
        search: {
            description: `Search, also called a query string, is the part of the URL containing a '?' 
                          followed by the parameters of the URL.`,
            type: 'string',
            example: '?q=Berlin'
        },
        hash: {
            description: `Hash is the part of the URL containing a '#' followed by the fragment 
                          identifier of the URL.`,
            type: 'string',
            example: '#event'
        },
    },
    required: [
        'href',
        'hostname',
        'pathname',
        'search',
        'hash'
    ],
    additionalProperties: false
};
```

## Event

By default, Kibanalytics measures the traffic on the website by tracking pageview events.

But if you want to track more specific interactions like form submissions, video views, user interactions etc., you need to programmatically dispatch custom events.

Custom events accept any kind of custom payloads and these can be optionally validated by a schema.

```javascript
const Event = {
    $id: '/schemas/event',
    title: 'Event',
    description: `Event dispatched by the tracker client lib.`,
    properties: {
        _id: {
            description: `Unique RFC4122 V4 identifier.`,
            type: 'string',
            minLength: 36,
            maxLength: 36,
            example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        type: {
            description: `Event type.`,
            type: 'string',
            example: 'pageview'
        },
        ts: {
            description: `Group of Date/Time timestamps & deltas.`,
            type: 'object',
            properties: {
                started: {
                    description: `Date/Time the event started represented by the number of 
                                  milliseconds since the ECMAScript epoch.`,
                    type: 'string',
                    minimum: 0,
                    example: 1649900818013 // Wed Apr 13 2022 22:46:58 GMT-0300
                },
                scriptStarted: {
                    description: `Date/Time the kbs script started represented by the number of 
                                  milliseconds since the ECMAScript epoch.`,
                    type: 'string',
                    minimum: 0,
                    example: 1649900818013 // Wed Apr 13 2022 22:46:58 GMT-0300
                },
                scriptEventStartedDelta: {
                    description: `Delta in milliseconds between the event Date/Time 
                                  and the kbs script started Date/Time.`,
                    type: 'string',         
                    minimum: 0,
                    example: 300000 // 5 minutes
                }
            },
            required: [
                'started',
                'scriptStarted',
                'scriptEventStartedDelta'
            ],
            additionalProperties: false
        },
        payload: {
            description: `Any custom data related to the event. Can be any kind of structure,
                          and optionally validated by a custom schema.`,
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: true,
            example: {
                foo: 'bar',
                element: {
                    tagName: 'BUTTON'
                },
                class: {
                    value: 'button02',
                    type: 'click',
                    prefix: 'kbs',
                    name: 'kbs-click-button02'
                }
            }
        }
    },
    required: [
        '_id',
        'type',
        'ts',
        'payload'
    ],
    additionalProperties: false
};
```

## Device

The device information is extracted from the user agent string using [UAParser.js](https://github.com/faisalman/ua-parser-js) library and from the browser [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API).

```javascript
const Device = {
    $id: '/schemas/device',
    title: 'Device',
    description: `Information about the user agent device.`,
    properties: {
        type: {
            description: `Device type based on user agent.`,
            type: 'string',
            enum: [
                'desktop',
                'mobile',
                'tablet',
                'console',
                'smarttv',
                'wearable',
                'embedded'
            ],
            example: 'desktop'
        },
        vendor: {
            description: `Device vendor based on user agent.`,
            type: 'string',
            example: 'Apple'
        },
        model: {
            description: `Device model based on user agent.`,
            type: 'string',
            example: 'SM-A515F'
        },
        cpu: {
            description: `Device CPU based on user agent.`,
            type: 'object',
            properties: {
                architecture: {
                    description: `CPU architecture.`,
                    type: 'string',
                    enum: [
                        '68k',
                        'amd64',
                        'arm[64/hf]',
                        'avr',
                        'ia[32/64]',
                        'irix[64]',
                        'mips[64]',
                        'pa-risc',
                        'ppc',
                        'sparc[64]'
                    ],
                    example: 'amd64'
                }
            },
            required: [
                'architecture'
            ],
            additionalProperties: false
        },
        platform: {
            description: `Device platform from Navigator.platform Web API. Most browsers, including 
                          Chrome, Edge, and Firefox 63 and later, return "Win32" even if 
                          running on a 64-bit version of Windows. Internet Explorer and versions 
                          of Firefox prior to version 63 still report "Win64"`,
            type: 'string',
            example: 'Linux armv8l'
        },
        os: {
            description: `Device operation system from user agent.`,
            type: 'object',
            properties: {
                name: {
                    description: `Operation system name.`,
                    type: 'string',
                    example: 'Windows'
                },
                version: {
                    description: `Operation system version.`,
                    type: 'string',
                    example: '10'
                }
            },
            required: [
                'name',
                'version'
            ],
            additionalProperties: false
        },
        screen: {
            description: `Device screen resolution from Screen Web API.`,
            type: 'object',
            properties: {
                width: {
                    description: `Screen width in pixels.`,
                    type: 'number',
                    example: 360
                },
                height: {
                    description: `Screen height in pixels.`,
                    type: 'number',
                    example: 800
                }
            },
            required: [
                'width',
                'height'
            ],
            additionalProperties: false
        },
    },
    required: [
        'type',
        'vendor',
        'model',
        'cpu',
        'platform',
        'os',
        'screen'
    ],
    additionalProperties: false
};
```

## Browser

A web browser is application software for accessing the internet or a local website. When a user requests a web page from a particular website, the web browser retrieves the necessary content from a web server and then displays the page on the user's device.

The browser information is extracted from the user agent string using [UAParser.js](https://github.com/faisalman/ua-parser-js) library, from the browser [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) and from tracker.js custom functions.

```javascript
const Browser = {
    $id: '/schemas/browser',
    title: 'Browser',
    description: `Information about the user agent browser.`,
    properties: {
        name: {
            description: `Browser name from user agent.`,
            type: 'string',
            example: 'Chrome'
        },
        version: {
            description: `Browser version from user agent.`,
            type: 'string',
            example: '100.0.4896.79'
        },
        majorVersion: {
            description: `Browser major version from user agent.`,
            type: 'string',
            example: '100'
        },
        engine: {
            description: `A browser engine (also known as rendering engine) is a core 
                          software component of every major web browser. The primary 
                          job of a browser engine is to transform HTML documents and other 
                          resources of a web page into an interactive visual representation 
                          on a user's device.`,
            type: 'object',
            properties: {
                name: {
                    description: `Engine name from user agent.`,
                    type: 'string',
                    example: 'Blink'
                },
                version: {
                    description: `Engine version from user agent.`,
                    type: 'string',
                    example: '100.0.4896.79'
                },
            },
            required: [
                'name',
                'version'
            ],
            additionalProperties: false
        },
        language: {
            description: `Browser interface language from Navigator.language Web API.`,
            type: 'string',
            example: 'ro'
        },
        cookies: {
            description: `Flag indicating if cookies is enabled.`,
            type: 'boolean',
            example: true
        },
        adBlock: {
            description: `Flag indicating if ad block is enabled.`,
            type: 'boolean',
            example: false
        }
    },
    required: [
        'name',
        'version',
        'majorVersion',
        'engine',
        'language',
        'cookies',
        'adBlock'
    ],
    additionalProperties: false
};
```

## User

An individual who interacts with a website. Each user can visit a website several times, creating multiple sessions.

By default, each unique device / web browser will be counted as a separate user, which means someone visiting your
website on multiple devices / browsers will mean more than one user reported.

User data is carried on new sessions, with exception if the previous session cookie is expired / deleted before the
regeneration of a new session.

```javascript
const User = {
    $id: '/schemas/user',
    title: 'User',
    description: ``,
    properties: {
        _id: {
            description: `Unique RFC4122 V4 identifier.`,
            type: 'string',
            minLength: 36,
            maxLength: 36,
            example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        new: {
            description: `Flag indicating if it is a new user. It's considered a new 
                          user when a user accesses the website for the first time.`,
            type: 'boolean',
            example: true
        },
        sessions: {
            description: `Session counter. Will increases the value when a session 
                          is regenerated.`,
            type: 'integer',
            exclusiveMinimum: 1,
            example: 10
        },
        events: {
            description: `Event counter. Will increases the value on any 
                          received event by the back-end. Represents the
                          events from all user sessions.`,
            type: 'integer',
            exclusiveMinimum: 0,
            example: 10
        },
        views: {
            description: `Page view counter. Will increases the value on 'pageview' 
                          event type received by the back-end. Represents the
                          page views from all user sessions.`,
            type: 'integer',
            minimum: 0,
            example: 5
        }
    },
    required: [
        '_id',
        'new',
        'sessions',
        'events',
        'views',
    ],
    additionalProperties: false
};
```

## Session

A web session is a series of contiguous actions by a visitor on an individual website within a given time frame. These
actions are called events.

A session will expire if the maximum lifetime of the cookie ('expires' cookie attribute) is exceeded.

::: tip
By default, the 'expires' cookie attribute is set to 90 days, but it can be changed on '/src/session.js'.
:::

Also, a session will expire if the current event timestamp and last event timestamp delta is greater than the
SESSION_DURATION value.

::: tip
By default, SESSION_DURATION is set to 30 minutes, but it can be changed on '/src/controller.js'.
:::

On this case, the session will be regenerated with a new session _id and will preserve the user data.

```javascript
const Session = {
    $id: '/schemas/session',
    title: 'Session',
    description: `Web session.`,
    type: 'object',
    properties: {
        _id: {
            description: `Unique RFC4122 V4 identifier.`,
            type: 'string',
            minLength: 36,
            maxLength: 36,
            example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
        new: {
            description: `Flag indicating if it is a new session. It's considered a new 
                          session when a user accesses the website for the first time or when 
                          he returns but the session has expired.`,
            type: 'boolean',
            example: true
        },
        events: {
            description: `Event counter. Will increases the value on any 
                          received event by the back-end in the session lifetime.`,
            type: 'integer',
            exclusiveMinimum: 0,
            example: 10
        },
        eventsFlow: {
            description: `All events fired during the current session 
                          sorted in order of occurrence.`,
            type: 'array',
            items: { $ref: '/schemas/event' },
            minItems: 1
        },
        lastEvent: {
            description: `Event prior to current event.`,
            $ref: '/schemas/event'
        },
        views: {
            description: `Page view counter. Will increases the value on 'pageview' 
                          event type received by the back-end in the session lifetime.`,
            type: 'integer',
            minimum: 0,
            example: 5
        },
        viewsFlow: {
            description: `All href's from page view events fired during the current session 
                          sorted in order of occurrence.`,
            type: 'array',
            items: {
                type: 'string'
            },
            example: [
                'https://www.virail.ro/',
                'https://www.virail.ro/zboruri-constanta-cluj_napoca'
            ]
        },
        ts: {
            description: `Group of Date/Time timestamps & deltas.`,
            type: 'object',
            properties: {
                started: {
                    description: `Date/Time the session started represented by the number of 
                                  milliseconds since the ECMAScript epoch.`,
                    type: 'integer',
                    minimum: 0,
                    example: 1649900818013 // Wed Apr 13 2022 22:46:58 GMT-0300
                },
                currentLastEventStartedDelta: {
                    description: `Delta in milliseconds between the current session event Date/Time 
                                  and the last session event Date/Time.`,
                    type: 'integer',
                    minimum: 0,
                    example: 300000 // 5 minutes
                }
            },
            required: [
                'started',
                'currentLastEventStartedDelta'
            ],
            additionalProperties: false
        }
    },
    required: [
        '_id',
        'new',
        'events',
        'eventsFlow',
        'views',
        'viewsFlow',
        'ts'
    ],
    additionalProperties: false
};
```

## IP

IP addresses are the identifier that allows information to be sent between devices on a network: they contain location
information and make devices accessible for communication.

This projects uses [GeoIP-lite](https://github.com/geoip-lite/node-geoip) library to parse IP geo mapping information.

GeoIP-lite includes the GeoLite database from [MaxMind](https://www.maxmind.com/). This database is not the most
accurate database available, however it is the best available for free. You can use the commercial GeoIP database from
MaxMind with better accuracy by buying a license from MaxMind, and then using the conversion utility to convert it to a
format that geoip-lite understands. You will need to use the .csv files from MaxMind for conversion.

::: warning
IP geolocation is inherently imprecise. Locations are often near the center of the population. Any location provided by
GeoIP-lite should not be used to identify a particular address or household.
:::

Both IPv4 and IPv6 addresses are supported, however for IPv6, since the free database GeoIP-lite uses does not currently contain any city
or region information, city, region and postal code lookups are only supported for IPv4.

```javascript
const Ip = {
    $id: '/schemas/ip',
    title: 'IP',
    description: `Group of properties related to a IP geo mapping information.`,
    properties: {
        address: {
            description: `Unique address (IPv4 or IPv6)that identifies a device 
                          on the internet or a local network.`,
            type: 'string',
            example: '37.29.245.229'
        },
        range: {
            description: `2-tutple of Low and high bound of IP block.`,
            type: 'array',
            items: {
                type: 'integer'
            },
            minItems: 2,
            maxItems: 2,
            example: [622720384, 622720511]
        },
        country: {
            description: `2 letter ISO-3166-1 country code.`,
            type: 'string',
            minLength: 2,
            maxLength: 2,
            example: 'ES'
        },
        eu: {
            description: `Flag indicating if the country is a member state of the European Union.`,
            type: 'boolean',
            example: true
        },
        region: {
            description: `Up to 3 alphanumeric variable length characters as ISO 3166-2 code.
                          For US states this is the 2 letter state, for the United Kingdom this could 
                          be ENG as a country like "England". FIPS 10-4 subcountry code.`,
            type: 'string',
            minLength: 2,
            maxLength: 3,
            example: 'ENG'
        },
        city: {
            description: `Full city name.`,
            type: 'string',
            example: 'Barcelona'
        },
        ll: {
            description: `2-tutple with the longitude and latitude coordinates of the city.`,
            type: 'array',
            items: {
                type: 'number'
            },
            minItems: 2,
            maxItems: 2,
            example: [2.1611, 41.3891]
        },
        area: {
            description: `The approximate accuracy radius (km), around the latitude and longitude.`,
            type: 'integer',
            example: 1000
        },
        metro: {
            description: `The metro code of the location if the location is in the US.`,
            type: 'integer',
            example: 641
        },
        timezone: {
            description: `Timezone (Country/Zone) from IANA Time Zone Database.`,
            type: 'string',
            example: 'Europe/Madrid'
        }
    },
    required: [
        'address',
        'range',
        'country',
        'eu',
        'region',
        'city',
        'll',
        'area',
        'metro',
        'timezone'
    ],
    additionalProperties: false
};
```

## Server Side

Any custom data and optionally validated by a custom schema.

```javascript
const ServerSide = {
    $id: '/schemas/server-side',
    title: 'Server Side',
    description: `Server side custom data.`,
    properties: {},
    required: [],
    additionalProperties: false
};
```

## Data Output Example

JSON Data from a pageview event saved to Kibanalytics database.

::: warning
It's not possible to guarantee the properties order of the output JSON object.
:::

```json
{
  "session": {
    "ts": {
      "started": 1649986123720,
      "currentLastEventStartedDelta": 25445
    },
    "views": 2,
    "events": 2,
    "new": false,
    "viewsFlow": [
      "https://www.virail.ca/trains-montreal-trois_rivieres",
      "https://www.virail.ca/trains-montreal-trois_rivieres"
    ],
    "lastEvent": {
      "ts": {
        "scriptEventStartedDelta": 3272,
        "started": 1649986126992,
        "scriptStarted": 1649986123720
      },
      "payload": {},
      "type": "pageview",
      "_id": "abc77ea0-031b-4d2b-a278-5f847a592bed"
    },
    "eventsFlow": [
      {
        "ts": {
          "scriptEventStartedDelta": 3272,
          "started": 1649986126992,
          "scriptStarted": 1649986123720
        },
        "payload": {},
        "href": "https://www.virail.ca/trains-montreal-trois_rivieres",
        "type": "pageview",
        "_id": "abc77ea0-031b-4d2b-a278-5f847a592bed"
      },
      {
        "ts": {
          "scriptEventStartedDelta": 2164,
          "started": 1649986152437,
          "scriptStarted": 1649986150273
        },
        "payload": {},
        "href": "https://www.virail.ca/trains-montreal-trois_rivieres",
        "type": "pageview",
        "_id": "59909535-76d7-4897-99e4-14e56ab1ef56"
      }
    ],
    "_id": "693f43b9-1e76-44e0-993d-2cef2c2fa653"
  },
  "browser": {
    "engine": {
      "name": "Blink",
      "version": "100.0.4896.79"
    },
    "name": "Chrome",
    "language": "fr",
    "adBlock": false,
    "cookies": true,
    "major": "100",
    "version": "100.0.4896.79"
  },
  "user": {
    "views": 2,
    "sessions": 1,
    "events": 2,
    "new": false,
    "_id": "7289a9f2-f195-407d-8ed4-275d4697f795"
  },
  "tracker_id": "N7TXY7",
  "userAgent": "Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.79 Mobile Safari/537.36",
  "referrer": "https://www.google.com/",
  "device": {
    "os": {
      "name": "Android",
      "version": "10"
    },
    "screen": {
      "width": 360,
      "height": 740
    },
    "vendor": "Samsung",
    "cpu": {},
    "model": "SM-G960U",
    "type": "mobile",
    "platform": "Linux armv8l"
  },
  "url": {
    "search": "",
    "hostname": "www.virail.ca",
    "hash": "",
    "href": "https://www.virail.ca/trains-montreal-trois_rivieres",
    "pathname": "/trains-montreal-trois_rivieres"
  },
  "event": {
    "ts": {
      "scriptEventStartedDelta": 2164,
      "started": 1649986152437,
      "scriptStarted": 1649986150273
    },
    "payload": {},
    "type": "pageview",
    "_id": "59909535-76d7-4897-99e4-14e56ab1ef56"
  },
  "ip": {
    "metro": 0,
    "city": "Saint-Jean-de-l'Ile-d'Orleans",
    "region": "QC",
    "range": "",
    "country": "CA",
    "area": 100,
    "address": "2001:56b:bce8:ca00:40de:6b6d:33c9:459a",
    "timezone": "America/Toronto",
    "eu": false,
    "ll": [
      46.9233,
      -70.8968
    ]
  },
  "serverSide": {}
}
```