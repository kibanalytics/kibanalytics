# Setup

## Environment Variables

Kibanalytics will look for a .env file at the root of the project folder to apply settings to the server.

::: tip
Use .env.example as base for your environment variables setup.
:::

| Variable                       |  Type  |                 Allowed Values |
|:-------------------------------|:------:|-------------------------------:|
| NODE_ENV                       | string |    'development', 'production' |
| NODE_CLUSTER                   |  int   |                           0, 1 |
| EXPRESS_PORT                   |  int   |     Any valid host port number |
| EXPRESS_HELMET                 |  int   |                           0, 1 | 
| EXPRESS_CORS                   |  int   |                           0, 1 |
| EXPRESS_ALLOWED_ORIGINS        | string | Any valid origin URL or RegExp |
| EXPRESS_GZIP                   |  int   |                           0, 1 |
| EXPRESS_SESSION_ID             | string |                     Any string |
| EXPRESS_SESSION_SECRET         | string |                     Any string |
| EXPRESS_VALIDATE_JSON_SCHEMA   |  int   |                           0, 1 |
| SENTRY_DSN                     | string |                            URL |
| REDIS_URI                      | string |                Valid Redis URI |
| ELASTICSEARCH_URI              | string |        Valid Elasticsearch URI |
| TRACKING_KEY                   | string |                         string |

### NODE_ENV

Flag which indicates whether the server is running on development or production mode.

### NODE_CLUSTER

Flag to enable or disable Node.js [clustering](https://nodejs.org/api/cluster.html).

This can drastically improve the performance on multicore deployments by starting one process for each core and
distributing the load of requests to the web server.

### EXPRESS_PORT

Define the web server host port to listen for connections.

### EXPRESS_HELMET

Define several security HTTP response headers to secure the web server.

Uses [Helmet](https://github.com/helmetjs/helmet) library for Express web servers.

If the Kibanalytics web server will be used in conjunction with a reverse proxy server, is recomended to disable Helmet and set
all security HTTP headers directly on the proxy.

### EXPRESS_CORS

Flag to enable or disable [CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS).
Used with EXPRESS_ALLOWED_ORIGINS enviroment variable.

### EXPRESS_ALLOWED_ORIGINS

Comma separated values of allowed origins for CORS. Used with EXPRESS_CORS enviroment variable.
Accept full origin URLs (for example https://www.virail.com), wildcard subdomains (for example *.virail.com) and
regular expressions (for example *.virail.[a-z\..]+).

::: warning
It's not possible to allow sharing with every origin by set '*' wildcard as allowed origin.
:::

### EXPRESS_GZIP

Flag to enable or disable HTTP response compress.

If the Kibanalytics web server will be used in conjunction with a reverse proxy server, is recomended to
disable Kibanalytics compression and let the reverse proxy take care of it.

### EXPRESS_SESSION_ID

The name of the session ID cookie to set in the response (and read from in the request).

::: tip
If you have multiple apps running on the same hostname
(this is just the name, i.e. localhost or 127.0.0.1; different schemes and ports do not name a different hostname),
then you need to separate the session cookies from each other. The simplest method is to simply set different names
per app.
:::

### EXPRESS_SESSION_SECRET

This is the secret used to sign the session ID cookie. Using a secret that cannot be guessed will reduce the ability
to hijack a session to only guessing the session ID.

Changing the secret value will invalidate all existing sessions.

### EXPRESS_VALIDATE_JSON_SCHEMA

Enable custom event payload validation.

### SENTRY_DSN

Enable [Sentry](https://sentry.io) performance and error tracking.

Disable with empty value.

### REDIS_URI

Redis server connection URI.

### ELASTICSEARCH_URI

[Elasticsearch](https://www.elastic.co) server connection URI.

### TRACKING_KEY

Key used for [Redis](https://redis.io) temporary store and Logstash index creation prefix.

## Docker-Compose

[Docker-Compose](https://docs.docker.com/compose/) is a tool that helps to define and share multi-container applications. As Kibanalytics is composed by a
stack of open source projects, it's easier for a quick start to use containers.

### Elasticsearch

### Redis

### Logstash

### Kibana