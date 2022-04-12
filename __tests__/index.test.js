require('dotenv').config();

const { readFileSync, existsSync, mkdirSync } = require('fs');
const { writeFile } = require('fs/promises');
const path = require('path');
const tunnel = require('tunnel-ssh');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

/*
    Elasticsearch clients are forward compatible; meaning that clients support communicating with greater
    or equal minor versions of Elasticsearch. Elasticsearch language clients are only backwards compatible with
    default distributions and without guarantees made.
 */
const { Client } = require('@elastic/elasticsearch');

const SERVER_URL = `http://localhost:${process.env.EXPRESS_PORT}`;

const OUTPUT_DIR_PATH = path.join(process.cwd(), '__tests__', 'output');
const BROWSER_HEADLESS = true;
const BROWSER_DEVTOOLS = false;

const CORS_ALLOWED_ORIGIN = 'https://www.virail.it';
const CORS_NOT_ALLOWED_ORIGIN = 'https://www.virail.com.br';
const CORS_ALLOWED_SUBDOMAINS = '*.meilisearch.com';

if (!existsSync(OUTPUT_DIR_PATH)) {
    mkdirSync(OUTPUT_DIR_PATH);
    console.log(`Output folder created at path ${OUTPUT_DIR_PATH}`);
}

describe('CORS', () => {
    const tunnelConfig = {
        agent: process.env.SSH_AUTH_SOCK,
        host: process.env.SSH_HOST,
        port: process.env.SSH_PORT,
        username: process.env.SSH_USER,
        privateKey: readFileSync('/Users/ibrahimnetto/.ssh/id_rsa'),
        dstHost: '10.0.1.2',
        dstPort: 9200,
        localHost: '127.0.0.1',
        localPort: 9200
    };

    const endpoint = '/collect'
    const headers = {
        'content-type': 'application/json'
    };
    const customSchemaBody = {
        tracker_id: 'N7TXY7',
        url: { href: 'http://localhost:3000/index.html', 'referrer': '' },
        event: { type: 'custom', payload: { foo: 'bar' } },
        device: { platform: 'MacIntel', screen: { width: 1680, height: 1050 } },
        browser: { language: 'en-US', adBlock: false, cookies: true },
        serverSide: {}
    };
    const allowedOrigins = process.env.EXPRESS_ALLOWED_ORIGINS.split(',');

    // Draft
    test('Test', async () => {
        const responsePromise = new Promise(async (resolve, reject) => {
            tunnel(tunnelConfig, (error, server) => {
                if (error) reject(error);
                const client = new Client({ node: 'http://127.0.0.1:9200' });

                client.search({
                    index: 'kibanalytics-*', // @TODO use env variable for index
                    body: {
                        query: {
                            bool: {
                                must: {
                                    term: {
                                        'event._id.keyword': '681161f9-7415-4bcf-bf85-476b388ad57a'
                                    }
                                }
                            }
                        }
                    }
                })
                    .then(response => resolve(response))
                    .catch(err => reject(err))
                    // .finally(server.close());

            });
        });

        const response = await responsePromise;
        console.log();
    });

    test(`Allowed Origin (${CORS_ALLOWED_ORIGIN})`, async () => {
        if (!process.env.EXPRESS_CORS || process.env.EXPRESS_CORS.toLowerCase() === 'false') {
            throw new Error('EXPRESS_CORS env not set | disabled');
        }

        if (allowedOrigins.findIndex(v => v === CORS_ALLOWED_ORIGIN) === -1) {
            throw new Error(`${CORS_ALLOWED_ORIGIN} not in EXPRESS_ALLOWED_ORIGINS env`);
        }

        const browser = await puppeteer.launch({
            headless: BROWSER_HEADLESS,
            devtools: BROWSER_DEVTOOLS
        });

        const page = await browser.newPage();
        await page.goto(CORS_ALLOWED_ORIGIN);

        const data = await page.evaluate(async (SERVER_URL, endpoint, headers, body) => {
            const url = new URL(`${SERVER_URL}${endpoint}`);
            body.url.href = location.href;

            try {
                const response = await fetch(url, {
                    method: 'post',
                    headers,
                    body: JSON.stringify(body),
                });

                return await response.json();
            } catch (err) {
                return err.toString();
            }
        }, SERVER_URL, endpoint, headers, customSchemaBody);

        await browser.close();
        expect(data.status).toEqual('success');

        const outputFileName = 'allowed-origin';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    }, 30000);

    test(`Not Allowed Origin (${CORS_NOT_ALLOWED_ORIGIN})`, async () => {
        if (!process.env.EXPRESS_CORS || process.env.EXPRESS_CORS.toLowerCase() === 'false') {
            throw new Error('EXPRESS_CORS not set | disabled');
        }

        if (allowedOrigins.findIndex(v => v === CORS_NOT_ALLOWED_ORIGIN) > -1) {
            throw new Error(`${CORS_NOT_ALLOWED_ORIGIN} in EXPRESS_ALLOWED_ORIGINS env`);
        }

        const browser = await puppeteer.launch({
            headless: BROWSER_HEADLESS,
            devtools: BROWSER_DEVTOOLS
        });

        const page = await browser.newPage();
        await page.goto(CORS_NOT_ALLOWED_ORIGIN);

        const data = await page.evaluate(async (SERVER_URL, endpoint, headers, body) => {
            const url = new URL(`${SERVER_URL}${endpoint}`);
            body.url.href = location.href;

            try {
                const response = await fetch(url, {
                    method: 'post',
                    headers,
                    body: JSON.stringify(body),
                });

                return await response.json();
            } catch (err) {
                return err.toString();
            }
        }, SERVER_URL, endpoint, headers, customSchemaBody);

        await browser.close();
        expect(data).toEqual('TypeError: Failed to fetch');

        const outputFileName = 'cors-error';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    }, 30000);

    test(`Allowed Subdomain (${CORS_ALLOWED_SUBDOMAINS})`, async () => {
        if (!process.env.EXPRESS_CORS || process.env.EXPRESS_CORS.toLowerCase() === 'false') {
            throw new Error('EXPRESS_CORS not set | disabled');
        }

        if (allowedOrigins.findIndex(v => v === CORS_ALLOWED_SUBDOMAINS) === -1) {
            throw new Error(`${CORS_ALLOWED_SUBDOMAINS} not in EXPRESS_ALLOWED_ORIGINS env`);
        }

        const browser = await puppeteer.launch({
            headless: BROWSER_HEADLESS,
            devtools: BROWSER_DEVTOOLS
        });

        const page = await browser.newPage();
        await page.goto(CORS_ALLOWED_SUBDOMAINS.replace('*', 'https://www'));

        const data = await page.evaluate(async (SERVER_URL, endpoint, headers, body) => {
            const url = new URL(`${SERVER_URL}${endpoint}`);
            body.url.href = location.href;

            try {
                const response = await fetch(url, {
                    method: 'post',
                    headers,
                    body: JSON.stringify(body),
                });

                return await response.json();
            } catch (err) {
                return err.toString();
            }
        }, SERVER_URL, endpoint, headers, customSchemaBody);

        await browser.close();
        expect(data.status).toEqual('success');

        const outputFileName = 'allowed-subdomains';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    }, 30000);
});