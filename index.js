require('dotenv').config();

const os = require('os');
const cluster = require('cluster');
const { Worker } = require('worker_threads');
const logger = require('./src/logger');
const redisSessionClient = require('./src/redis-session-client');
const redisQueueClient = require('./src/redis-queue-client');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const expressWinston = require('express-winston');
const Sentry = require('@sentry/node');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./src/cors-options');
const session = require('./src/session');
const varnishHeaders = require('./src/varnish-headers');
const controller = require('./src/controller');
const errorHandler = require('./src/error-handler');

const { EXPRESS_PORT } = require('./src/constants');

const init = async () => {
    await redisSessionClient.connect();
    await redisQueueClient.connect();
    const app = express();

    app.use(bodyParser.json());

    app.use(expressWinston.logger({
        winstonInstance: logger,
        meta: false,
        expressFormat: true,
        colorize: true
    }));

    if (process.env.SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.SENTRY_DSN
        });
        app.use(Sentry.Handlers.requestHandler());
    }

    if (!!+process.env.EXPRESS_VARNISH_HEADERS) {
        app.use(varnishHeaders);
    }

    if (!!+process.env.EXPRESS_GZIP) {
        /*
            For use on servers without reverse-proxy
         */
        app.use(compression());
    }

    if (!!+process.env.EXPRESS_CORS) {
        app.use(cors(corsOptions));
    }

    if (!!+process.env.EXPRESS_HELMET) {
        /*
            For use on servers without reverse-proxy
         */
        app.use(helmet({
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
            crossOriginResourcePolicy: { policy: 'cross-origin' }
        }));
    }

    if (!!+process.env.EXPRESS_PUBLIC_FOLDER) {
        app.use(express.static('public'));
    } else {
        app.get('/', (req, res) => {
            res.redirect('https://kibanalytics.io');
        });
    }

    app.get(`/${process.env.TRACKER_FILE_ALIAS ?? 'kbs.js'}`, (req, res) => {
        res.sendFile('dist/tracker.min.js', { root: './public' });
    });

    app.get('/robots.txt', (req, res) => {
        res.sendFile('robots.txt', { root: './public' });
    });

    app.use(session);
    /*
        If you have node.js behind a proxy and are using cookies secure: true,
        you need to set "trust proxy" in express.
     */
    if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

    app.post('/', controller.collect);
    app.post(`/${process.env.COLLECT_ENDPOINT ?? 'collect'}`, controller.collect);
    app.get('/health', controller.health);

    if (process.env.SENTRY_DSN) {
        app.use(Sentry.Handlers.errorHandler());
    }
    app.use(errorHandler);

    app.listen(EXPRESS_PORT, () => {
        logger.info(`Express app listening on port ${EXPRESS_PORT}`);
    });
};

const clusterWorkerSize = (!!+process.env.NODE_CLUSTER) ? os.cpus().length : 1;

if (clusterWorkerSize > 1) {
    if (cluster.isMaster) {
        for (let i = 0; i < clusterWorkerSize; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker) => {
            logger.info(`Worker ${worker.id} has exited`);
        });
    } else {
        init();
    }
} else {
    init();
}

if (!!+process.env.KIBANA_LOAD_DEFAULT_DASHBOARDS) {
    const loadDashboardsWorker = new Worker('./src/dashboards/load.dashboards.js');
    loadDashboardsWorker.on('error', (err) => logger.error(err?.stack));
    loadDashboardsWorker.on('exit', (code) => logger.info(`Load Dashboards Worker has stopped with code ${code}`));
}