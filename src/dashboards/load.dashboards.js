const fetch = require('node-fetch');
const delay = require('delay');
const logger = require('../logger');
const indexTemplate = require('./index-template.dashboards.json');
const dashboard = require('./export.dashboards.json');

const LOGGER_PREFIX = 'Load Dashboards Worker';
const KIBANA_WAIT_MS = 12000;

(async () => {
    logger.info(`${LOGGER_PREFIX} - Started`);
    let kibanaReady = false;

    logger.info(`${LOGGER_PREFIX} - Checking if Kibana is ready...`);
    while (!await isKibanaReady()) {
        await delay(KIBANA_WAIT_MS);
        logger.info(`${LOGGER_PREFIX} - Waiting for Kibana...`);
        kibanaReady = await isKibanaReady();
    }
    logger.info(`${LOGGER_PREFIX} - Kibana ready`);

    const pattern = `${process.env.REDIS_QUEUE_KEY}-*`;

    logger.info(`${LOGGER_PREFIX} - Checking index pattern ${pattern}`);
    let indexPattern = await getIndexPattern(pattern);

    if (!indexPattern) {
        logger.info(`${LOGGER_PREFIX} - Creating index pattern ${pattern}`);
        indexPattern = await createIndexPattern(pattern);

        logger.info(`${LOGGER_PREFIX} - Setting index pattern ${pattern} as default`);
        await setDefaultIndexPattern(indexPattern.id);

        logger.info(`${LOGGER_PREFIX} - Creating template for index pattern ${pattern}`);
        await createIndexTemplate(pattern, indexTemplate);
    }

    /*
     *  This implementation assumes that the entire dashboard uses only one type of index pattern
     */
    logger.info(`${LOGGER_PREFIX} - Setting dashboard index reference`);
    for (const entry of dashboard) {
        for (const reference of entry.references) {
            if (reference.type === 'index-pattern') {
                reference.id = indexPattern.id;
            }
        }
    }

    logger.info(`${LOGGER_PREFIX} - Importing dashboard`);
    await importDashboard(dashboard);

    logger.info(`${LOGGER_PREFIX} - Finished`);
    process.exit(0);
})();

async function isKibanaReady() {
    try {
        const headers = {
            'content-type': 'application/json'
        };
        const options = {
            method: 'get',
            headers
        };
        const response = await fetch(`${process.env.KIBANA_SERVER_URI}/api/task_manager/_health`, options);
        const json = await response.json();

        return json.status === 'OK';
    } catch {
        return false;
    }
}

async function getIndexPattern(pattern) {
    try {
        const url = new URL(`${process.env.KIBANA_SERVER_URI}/api/saved_objects/_find`);

        const params = {
            type: 'index-pattern',
            fields: ['type', 'title'],
            search_fields: 'title',
            search: pattern
        };
        url.search = new URLSearchParams(params).toString();

        const headers = {
            'content-type': 'application/json',
            'kbn-xsrf': 'reporting'
        };

        const options = {
            method: 'get',
            headers
        };

        const response = await fetch(url, options)
            .then(response => response.json());

        return response.total >= 1 ? response.saved_objects[0] : null;
    } catch {
        return null;
    }
}

async function createIndexPattern() {
    const headers = {
        'content-type': 'application/json',
        'kbn-xsrf': 'reporting'
    };
    const body = {
        override: false,
        refresh_fields: true,
        index_pattern: {
            title: `${process.env.REDIS_QUEUE_KEY}-*`,
            timeFieldName: '@timestamp'
        }
    };
    const options = {
        method: 'post',
        headers,
        body: JSON.stringify(body)
    };
    const response = await fetch(`${process.env.KIBANA_SERVER_URI}/api/index_patterns/index_pattern`, options)
        .then(response => response.json());

    return response.index_pattern;
}

async function setDefaultIndexPattern(index_id) {
    const headers = {
        'content-type': 'application/json',
        'kbn-xsrf': 'reporting'
    };
    const body = {
        index_pattern_id: index_id,
        force: true
    };
    const options = {
        method: 'post',
        headers,
        body: JSON.stringify(body)
    };
    const response = await fetch(`${process.env.KIBANA_SERVER_URI}/api/index_patterns/default`, options)
        .then(response => response.json());

    return response.acknowledged === true;
}

async function createIndexTemplate(pattern, template) {
    const headers = {
        'content-type': 'application/json'
    };
    const body = {
        index_patterns: [pattern],
        priority: 1,
        template
    };
    const options = {
        method: 'put',
        headers,
        body: JSON.stringify(body)
    };
    const response = await fetch(`${process.env.ELASTICSEARCH_URI}/_index_template/kibanalytics`, options)
        .then(response => response.json());

    return response.acknowledged === true;
}

async function importDashboard(dashboard) {
    const headers = {
        'content-type': 'application/json',
        'kbn-xsrf': 'reporting'
    };
    const body = {
        objects: dashboard
    };
    const options = {
        method: 'post',
        headers,
        body: JSON.stringify(body)
    };
    return await fetch(`${process.env.KIBANA_SERVER_URI}/api/kibana/dashboards/import?force=true&exclude=index-pattern`, options)
        .then(response => response.json()).catch((err) => {
            console.log(err);
        });
}