# Setup

To start Kibanalytics, it's mandatory to provide some basic configurations.

## Environment Variables

Kibanalytics will look for a .env file at the root of the project folder to apply settings to the server.

::: tip
Use .env.example as base for your environment variables setup.
If you just want start straightaway, just rename .env.example to .env and use all default values. 
:::

| Variable                           |  Type  |                      Allowed Values |
|:-----------------------------------|:------:|------------------------------------:|
| NODE_ENV                           | string |         'development', 'production' |
| NODE_CLUSTER                       |  int   |                                0, 1 |
| EXPRESS_PORT                       |  int   |              Valid host port number |
| EXPRESS_HELMET                     |  int   |                                0, 1 | 
| EXPRESS_CORS                       |  int   |                                0, 1 |
| EXPRESS_ALLOWED_ORIGINS            | string |      Any valid origin URL or RegExp |
| EXPRESS_GZIP                       |  int   |                                0, 1 |
| EXPRESS_SESSION_ID                 | string |                          Any string |
| EXPRESS_SESSION_SECRET             | string |                          Any string |
| EXPRESS_VALIDATE_JSON_SCHEMA       |  int   |                                0, 1 |
| SENTRY_DSN                         | string |                                 URL |
| REDIS_HOST                         | string |                    Valid Redis host |
| REDIS_PORT                         |  int   |              Valid host port number |
| ELASTICSEARCH_URI                  | string |             Valid Elasticsearch URI |
| TRACKING_KEY                       | string |                        Valid string |
| DOCKER_LOG_MAX_SIZE                | string | Number >= 1 suffixed with magnitude |
| DOCKER_LOG_MAX_FILE                |  int   |                         Number >= 1 |

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

### REDIS_HOST

Redis server host. 

To point to the local Redis server started with Docker Compose, 
use the value "redis" as it is an alias to the internal Docker network Redis host.

### REDIS_PORT

Redis server host port.

### ELASTICSEARCH_URI

[Elasticsearch](https://www.elastic.co) server connection URI.

To point to the local Elasticsearch server started with Docker Compose,
use the value "http://elasticsearch:9200" as it is an alias to the internal Docker network Elasticsearch host.

### TRACKING_KEY

Key used for [Redis](https://redis.io) temporary store and Logstash index creation prefix.

### DOCKER_LOG_MAX_SIZE

Docker log file max size.

### DOCKER_LOG_MAX_FILE

Docker log files max count.

## Docker-Compose

[Docker-Compose](https://docs.docker.com/compose/) is a tool that helps to define and share multi-container applications. 
As Kibanalytics is composed by a stack of open source projects, it's easier for a quick start to use containers.

It's necessary to install Docker and Docker-Compose to the host where Kibanalytics will run.

[Docker instalation setup](https://docs.docker.com/engine/install/)

[Docker-Compose instalation setup](https://docs.docker.com/compose/install/)

After completing all the setup steps from Docker and Docker-Compose, to start Kibanalytics using 
the provided .env file with default configuration values, just run:

```bash
docker-compose up
```

After all containers started, you can open Kibana to check events and metrics 
by accessing [http://localhost:5601/](http://localhost:5601/).

::: tip
Kibana server take some minutes to boot, so don't panic if you try to access the Kibana URL and nothing shows up.
:::

If you started Kibanalytics with NODE_ENV=development and EXPRESS_PORT=3000, you can also access 
[http://localhost:3000/](http://localhost:3000/) to interact with some example pages to generate events. 

## Advanced Configurations

It's possible to provide some aditional advanced configurations to Kibanalytics engine gears by editing the corresponding
files in "/config" folder.

### Redis

To provide aditional settings to the local Redis instance, edit "/config/redis/redis.conf" file.
For more information about the available setting options, please check 
[Redis configuration](https://redis.io/docs/manual/config/) docs.

### Logstash

To provide aditional settings to the local Logstash instance, edit "/config/logstash/logstash.yml" file. 
For more information about the available setting options, please check
[Logstash Configuration](https://www.elastic.co/guide/en/logstash/current/logstash-settings-file.html) docs.

Also, it's possible to edit que main Logstash pipeline by editing "/config/logstash/pipeline/tracker.conf" file. 
For more information about pipeline settings, please check 
[Configuring Logstash](https://www.elastic.co/guide/en/logstash/current/configuration.html) docs.

### Kibana

To provide aditional settings to the local Kibana instance, edit "/config/kibana/kibana.yml" file.
For more information about the available setting options, please check
[Configure Kibana](https://www.elastic.co/guide/en/kibana/current/settings.html) docs.