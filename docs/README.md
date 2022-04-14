---
title: Website analytics
lang: en-US
---

# Kibanalytics

[[toc]]

This project aims to make use of the [ELK stack](https://www.elastic.co/what-is/elk-stack) to collect events from web pages and visualize them, offering the same kind of insights that [Google Analytics](https://analytics.google.com/analytics/web/) does.

The reason behind this project is to provide an alternative to GA, that offers data ownership, adblocker avoidance, powerful aggregations, grained filtering and big data storage.

## Setup

### Environment Variables

Kibanalytics will look for a .env file at the root of the project folder to apply settings to the server.

::: tip
Use .env.example as base for your environment variables setup.
:::

| Name                     | Type           | Allowed Values          | Description  |
|:------------------------ |:--------------:| -----------------------:| ------------:|
| NODE_ENV                 | string         | development, production |  |
| NODE_CLUSTER             | int            |   0, 1                  |  |
| EXPRESS_PORT             | int            |   -                     |  |
| EXPRESS_HELMET           | int            |   0, 1                  |  |
| EXPRESS_CORS             | int            |   0, 1                  |  |
| EXPRESS_ALLOWED_ORIGINS  | int            |   -                     |  |
| EXPRESS_GZIP             | int            |   0, 1                  |  |
| EXPRESS_SESSION_ID       | int            |   -                     |  |
| EXPRESS_SESSION_SECRET   | int            |   -                     |  |
| SENTRY_DSN               | int            |   -                     |  |
| REDIS_HOST               | int            |   -                     |  |
| REDIS_USERNAME           | int            |   -                     |  |
| REDIS_PASSWORD           | int            |   -                     |  |
| REDIS_URIS               | int            |   -                     |  |
| TRACKING_KEY             | int            |   -                     |  |
| ELASTICSEARCH_URIS       | int            |   -                     |  |
| VALIDATE_JSON_SCHEMA     | int            |   0, 1                  |  |

### Docker-Compose

#### Elasticsearch

#### Redis

#### Logstash

#### Kibana

### Back-End Node.js Server

### Front-End Tracker Library

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    <script src="kbs.js" data-tracker-id="BH3HJ78FCV"></script>
    ...
</head>
<body>
...
</body>
</html>
```

| Name                     | Type           | Allowed Values          | Description  |
|:------------------------ |:--------------:| -----------------------:| ------------:|
| data-tracker-id          | string         |                         |  |
| data-server-url          | string         |                         |  |

## Schema

```javascript
const Schema = {
    title: 'Schema',
    description: `Output JSON document with all tracked data.`,
    properties: {
        tracker_id: {
            description: ``,
            type: 'string',
            example: ''
        }
    },
    required: [
        'tracker_id'
    ]
};
```

### URL

```javascript
const Url = {
    title: 'URL',
    description: ``,
    properties: {
        
    },
    required: [
        
    ]
};
```

### Event

```javascript
const Event = {
    title: 'Event',
    description: ``,
    properties: {
        _id: {
            description: `Unique RFC4122 V4 identifier.`,
            type: 'string',
            minLength: 36,
            maxLength: 36,
            example: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        },
    },
    required: [
        '_id'
    ]
};
```

### Device

```javascript
const Device = {
    title: 'Device',
    description: ``,
    properties: {
        
    },
    required: [
        
    ]
};
```

### Browser

```javascript
const Browser = {
    title: 'Browser',
    description: ``,
    properties: {
        
    },
    required: [
        
    ]
};
```

### User

An individual who interacts with a website. Each user can visit a website several times, creating multiple sessions.

By default, each unique device / web browser will be counted as a separate user, which means someone visiting your website on multiple devices / browsers will mean more than one user reported.

User data is carried on new sessions, with exception if the previous session cookie is expired / deleted before the regeneration of a new session.

```javascript
const User = {
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
        },
    },
    required: [
        '_id',
        'new'
    ]
};
```

### Session

A web session is a series of contiguous actions by a visitor on an individual website within a given time frame. These actions are called events.

A session will expire if the maximum lifetime of the cookie ('expires' cookie attribute) is exceeded.

::: tip
By default, the 'expires' cookie attribute is set to 90 days, but it can be changed on '/src/session.js'.
:::

Also, a session will expire if the current event timestamp and last event timestamp delta is greater than the SESSION_DURATION value. 

::: tip
By default, SESSION_DURATION is set to 30 minutes, but it can be changed on '/src/controller.js'.
:::

On this case, the session will be regenerated with a new session _id and will preserve the user data.

```javascript
const Session = {
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
        views: {
            description: `Page view counter. Will increases the value on 'pageview' 
                          event type received by the back-end in the session lifetime.`,
            type: 'integer',
            minimum: 0,
            example: 5
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
                    description: `Delta in miliseconds between the current session event Date/Time 
                                  and the last session event Date/Time.`,
                    type: 'integer',
                    minimum: 0,
                    example: 300000 // 5 minutes
                }
            },
            required: [
                'started',
                'currentLastEventStartedDelta'
            ]
        }
    },
    required: [
        '_id',
        'new',
        'events',
        'views'
    ]
};
```

### IP

```javascript
const Ip = {
    title: 'IP',
    description: ``,
    properties: {

    },
    required: [

    ]
};
```

### Server Side

```javascript
const ServerSide = {
    title: 'Server Side',
    description: ``,
    properties: {

    },
    required: [

    ]
};
```