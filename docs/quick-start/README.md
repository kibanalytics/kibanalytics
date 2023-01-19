# Quick Start

## Requirements

Host server with the following installed software:

- [Git](https://git-scm.com/)
- [Docker-Compose](https://docs.docker.com/compose/)

## Step-By-Step

### 1. Download Kibanalytics Code Repository

```bash
git clone https://github.com/kibanalytics/kibanalytics.git
cd kibanalytics
```

### 2. Copy Default Configuration Files

By default, all CORS origins are allowed to call Kibanalytics back-end server.

```bash
cp .env.example .env
cp -r .config.example .config
```

::: warning
It's recomended to change the EXPRESS_SESSION_SECRET and ELASTICSEARCH_PASSWORD environment variables default values
before running Kibanalytics in production.
:::

### 3. Start Docker Services

```bash
docker-compose --profile local --profile production up -d --build
```

### 4. Load Default Dashboards

```bash
docker-compose exec node npm run load-dashboards
```

### 5. Add Front-End Tracking Library

Remember to change the server URL according to your server hostname / domain if you're not running on localhost.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website To Track</title>
    <script src="http://localhost:3000/kbs.js" 
            data-server-url="http://localhost:3000/collect">
    </script>
    ...
</head>
<body>
    <h1>My Website Header</h1>
    <main>My Website Main Content</main>
...
</body>
</html>
```

Alternatively you can access [http://localhost:3000](http://my-kibanalytics-server-host:3000) to interact with some example pages.

### 6. Open Example Dashboard

By accessing [http://localhost:5601/app/dashboards](http://localhost:5601/app/dashboards).