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