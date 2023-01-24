# Setup

## Requirements

The only requirement for Kibanalytics is a server with [Git](https://git-scm.com/) and 
[Docker-Compose](https://docs.docker.com/compose/) installed. All required services are build and abtracted Docker
containers.

## Source Code

[Git](https://git-scm.com/) is a free and open source distributed version control system.

The easiest way to get Kibanalytics source code is by installing Git and running the following command:

```bash
git clone https://github.com/kibanalytics/kibanalytics.git
```

Before starting Kibanalytics, it's mandatory to provide some basic configuration files and environment variales.

## Environment Variables

Kibanalytics will look for a .env file at the root of the project folder to apply settings to the server.

::: tip
Use .env.example as base for your environment variables setup.
If you just want start straightaway, just rename .env.example to .env and use all default values.

```bash
cp .env.example .env
```
:::

::: warning
It's recomended to change the EXPRESS_SESSION_SECRET and ELASTICSEARCH_PASSWORD environment variables default values
before running Kibanalytics in production.
:::

| Variable                         |   Type   |                           Allowed Values |
|:---------------------------------|:--------:|-----------------------------------------:|
| NODE_ENV                         |  string  |              'development', 'production' |
| NODE_CLUSTER                     |   int    |                                     0, 1 |
| NODE_LISTEN                      |  string  |            Valid host IP and port number |
| EXPRESS_HELMET                   |   int    |                                     0, 1 | 
| EXPRESS_GZIP                     |   int    |                                     0, 1 |
| EXPRESS_CORS                     |   int    |                                     0, 1 |
| EXPRESS_ALLOWED_ORIGINS          | [string] |                         Any valid RegExp |
| EXPRESS_SESSION_NAME             |  string  |                               Any string |
| EXPRESS_SESSION_SECRET           |  string  |                               Any string |
| EXPRESS_SESSION_COOKIE_MAX_AGE   |   int    |                              Number >= 0 |
| EXPRESS_SESSION_COOKIE_SAME_SITE |  string  |       '0', '1', lax', 'none' or 'strict' |
| EXPRESS_SESSION_COOKIE_SECURE    |   int    |                                     0, 1 |
| EXPRESS_SESSION_DURATION         |   int    |                              Number >= 0 |
| EXPRESS_VALIDATE_JSON_SCHEMA     |   int    |                                     0, 1 |
| EXPRESS_ANONYMIZE_USER_IP        |   int    |                                     0, 1 |
| EXPRESS_PUBLIC_FOLDER            |   int    |                                     0, 1 |
| SENTRY_DSN                       |  string  |                     Valid Sentry DSN URL |
| LOGSTASH_REDIS_HOST              |  string  |                         Valid Redis host |
| LOGSTASH_REDIS_PORT              |   int    |             Valid Redis host port number |
| REDIS_LISTEN                     |  string  |            Valid host IP and port number |
| REDIS_QUEUE_SERVER_URI           |  string  |                          Valid Redis URI |
| REDIS_SESSION_SERVER_URI         |  string  |                          Valid Redis URI |
| TWEMPROXY_LISTEN                 |  string  |            Valid host IP and port number |
| ELASTICSEARCH_LISTEN             |  string  |            Valid host IP and port number |
| ELASTICSEARCH_URI                |  string  |                  Valid Elasticsearch URI |
| ELASTICSEARCH_SECURITY           |   bool   |                              true, false |
| ELASTICSEARCH_USERNAME           |  string  |                               Any string |
| ELASTICSEARCH_PASSWORD           |  string  |                               Any string |
| KIBANA_LISTEN                    |  string  |            Valid host IP and port number |
| DOCKER_LOG_MAX_SIZE              |  string  |      Number >= 1 suffixed with magnitude |
| DOCKER_LOG_MAX_FILE              |   int    |                              Number >= 1 |

### NODE_ENV

Flag which indicates whether the server is running on development or production mode.

If you're running Node.js outside of docker enviroment, set the value of NODE_ENV to "development".

### NODE_CLUSTER

Flag to enable or disable Node.js [clustering](https://nodejs.org/api/cluster.html).

This can drastically improve the performance on multicore deployments by starting one process for each core and
distributing the load of requests to the web server.

### NODE_LISTEN

Expose Node Docker service host ip and port number for external connections.

### EXPRESS_HELMET

Define several security HTTP response headers to secure the web server.

Uses [Helmet](https://github.com/helmetjs/helmet) library for Express web servers.

If the Kibanalytics web server will be used in conjunction with a reverse proxy server, is recomended to disable Helmet and set
all security HTTP headers directly on the proxy.

### EXPRESS_GZIP

Flag to enable or disable HTTP response compress.

If the Kibanalytics web server will be used in conjunction with a reverse proxy server, is recomended to
disable Kibanalytics compression and let the reverse proxy take care of it.

### EXPRESS_CORS

Flag to enable or disable [CORS](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/CORS).
Used with EXPRESS_ALLOWED_ORIGINS environment variable.

### EXPRESS_ALLOWED_ORIGINS

Comma separated RegExp values of allowed origins (for example .*virail.[a-z\..]+) for CORS. Used with EXPRESS_CORS environment variable.

### EXPRESS_SESSION_NAME

The name of the session cookie to set in the response (and read from in the request).

::: tip
If you have multiple apps running on the same hostname then you need to use distinct session cookies from each one. 
The simplest way is to set different name session names per app.
:::

### EXPRESS_SESSION_SECRET

This is the secret used to sign the session cookie. Using a secret that cannot be guessed will reduce the ability
to hijack a session by guessing the session name.

Changing the secret value will invalidate all existing sessions.

### EXPRESS_SESSION_COOKIE_MAX_AGE

Specifies the number (in milliseconds) to use when calculating the Expires Set-Cookie attribute. 
This is done by taking the current server time and adding maxAge 
milliseconds to the value to calculate an Expires datetime. 
By default, 7776000000 (90d) is set.

### EXPRESS_SESSION_COOKIE_SAME_SITE

Specifies the boolean or string to be the value for the SameSite Set-Cookie attribute. By default, this is '1'.

'1' will set the SameSite attribute to Strict for strict same site enforcement.

'0' will not set the SameSite attribute.

'lax' will set the SameSite attribute to Lax for lax same site enforcement.

'none' will set the SameSite attribute to None for an explicit cross-site cookie.

'strict' will set the SameSite attribute to Strict for strict same site enforcement.

### EXPRESS_SESSION_COOKIE_SECURE

Specifies the boolean value for the Secure Set-Cookie attribute. When '1', the Secure attribute is set, otherwise it is not. 
By default, the Secure attribute is '0'.

### EXPRESS_SESSION_DURATION

Session duration is defined as the time frame during which there are regular active interactions occurring 
between a user. The session is timed out when there is no activity from the user for a predefined time duration of 1800000ms (30 minutes by default).

### EXPRESS_VALIDATE_JSON_SCHEMA

Enable custom event payload validation.

### EXPRESS_ANONYMIZE_USER_IP

Hash user IP address for privacy.

### EXPRESS_PUBLIC_FOLDER

Serve the public folder on the web server. Used to for development & testing.

### SENTRY_DSN

Enable [Sentry](https://sentry.io) performance and error tracking.

Disable with empty value.

### LOGSTASH_REDIS_HOST

Redis queue server hostname.

### LOGSTASH_REDIS_PORT

Redis queue server port.

### REDIS_LISTEN

Expose Redis Docker service host ip and port number for external connections.

### REDIS_QUEUE_SERVER_URI

Redis queue server connection URI. Needs to use the same values from LOGSTASH_REDIS_HOST and LOGSTASH_REDIS_PORT variables.
This is necessary because some services needs to use hostname / port and others only accept URI connection string.

### REDIS_SESSION_SERVER_URI

Redis session server connection URI.

### TWEMPROXY_LISTEN

Expose Twemproxy Docker service host ip and port number for external connections.

### ELASTICSEARCH_LISTEN

Expose Elasticsearch Docker service host ip and port number for external connections.

### ELASTICSEARCH_URI

[Elasticsearch](https://www.elastic.co) server connection URI.

To point to the local Elasticsearch server started with Docker Compose,
use the value "http://elasticsearch:9200" as it is an alias to the internal Docker network Elasticsearch host.

If NODE_ENV is set to "development", Node.js server will override ELASTICSEARCH_URI value to "http://localhost:9200".

### ELASTICSEARCH_SECURITY

Enable or disable Elasticsearch security. By enabling this flag, Kibana access will also
require an username & password.

### ELASTICSEARCH_USERNAME

Elasticsearch username. Used with ELASTICSEARCH_SECURITY=true.

### ELASTICSEARCH_PASSWORD

Elasticsearch password. Used with ELASTICSEARCH_SECURITY=true.

### KIBANA_LISTEN

Expose Kibana Docker service host ip and port number for external connections.

### DOCKER_LOG_MAX_SIZE

Docker log file max size.

### DOCKER_LOG_MAX_FILE

Docker log files max count.

## Install

[Docker-Compose](https://docs.docker.com/compose/) is a tool that helps to define and share multi-container applications. 
As Kibanalytics is composed by a stack of open source projects, it's easier for a quick start to use containers.

It's necessary to install Docker and Docker-Compose to the host/server where Kibanalytics will run.

[Docker instalation setup](https://docs.docker.com/engine/install/)

[Docker-Compose instalation setup](https://docs.docker.com/compose/install/)

After completing all the setup steps from Docker and Docker-Compose, to start Kibanalytics using 
the default configuration, run the following commands:

```bash
cd kibanalytics
cp .env.example .env
cp -r .config.example .config
docker-compose --profile local --profile production up -d --build
```

If you're starting Kibanalytics for the first time, it's necessary to [create a Kibana index pattern](https://www.elastic.co/guide/en/kibana/7.17/index-patterns.html) 
to be able to visualize the collected data.

To make this process easier, we provide a script to automate this process and also load the default dashboards. To run the
script, execute the following command:

```bash
docker-compose exec node npm run load-dashboards
```

After all containers started, you can open Kibana to check events and metrics 
by accessing [http://localhost:5601/app/dashboards](http://localhost:5601/app/dashboards).

::: tip
Kibana server take some minutes to boot, so don't panic if you try to access the Kibana URL and nothing shows up.
:::

If you started Kibanalytics with EXPRESS_PUBLIC_FOLDER=1 and EXPRESS_PORT=3000, you can also access 
[http://localhost:3000](http://localhost:3000) to interact with some example pages to generate events. 

## Advanced Configurations

It's possible to provide some aditional advanced configurations to Kibanalytics engine gears by editing the corresponding
files in "/.config" folder.

### Redis

To provide aditional settings to the local Redis instance, edit ".config/redis/redis.conf" file.
For more information about the available setting options, please check 
[Redis configuration](https://redis.io/docs/manual/config) docs.

### Twemproxy

To provide aditional settings to the local Twemproxy instance, edit ".config/twemproxy/twemproxy.yml" file.
For more information about the available setting options, please check
[Twemproxy Configuration](https://github.com/twitter/twemproxy) docs.

### Logstash

To provide aditional settings to the local Logstash instance, edit ".config/logstash/logstash.yml" file. 
For more information about the available setting options, please check
[Logstash Configuration](https://www.elastic.co/guide/en/logstash/current/logstash-settings-file.html) docs.

Also, it's possible to edit que main Logstash pipeline by editing ".config/logstash/pipeline/tracker.conf" file. 
For more information about pipeline settings, please check 
[Configuring Logstash](https://www.elastic.co/guide/en/logstash/current/configuration.html) docs.

### Kibana

To provide aditional settings to the local Kibana instance, edit ".config/kibana/kibana.yml" file.
For more information about the available setting options, please check
[Configure Kibana](https://www.elastic.co/guide/en/kibana/current/settings.html) docs.