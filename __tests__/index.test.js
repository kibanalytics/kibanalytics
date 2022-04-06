require('dotenv').config();

const { existsSync, mkdirSync } = require('fs');
const { writeFile } = require('fs/promises');
const path = require('path');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const { Client } = require('@elastic/elasticsearch')

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

/*

const serverApiRequest = async (server, endpoint, headers, params, outputFileName) => {
    const url = new URL(`${server}${endpoint}`);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        throw {
            status: response.status,
            statusText: response.statusText
        }
    }

    const data = await response.json();
    expect(data.status).toEqual('success');

    const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
    await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Response saved at path ${outputFilePath}`);
}

 */

describe('Collect Controller', () => {
    const server = `http://localhost:${process.env.EXPRESS_PORT}`;
    const endpoint = '/collect'
    const headers = {
        'content-type': 'application/json'
    };
    const customSchemaBody = { type: 'custom', payload: { foo: 'bar' } };
    const allowedOrigins = process.env.EXPRESS_ALLOWED_ORIGINS.split(',');

    test('Test', async () => {
        const client = new Client({ node: 'http://localhost:9200' });

        const document = await client.search({
            index: 'tracker-*',
            body: {
                query: {
                    bool: {
                        must: {
                            term: {
                                'event._id.keyword': '8a8a0324-9dac-4bac-8f7a-81bf2f7f9a67'
                            }
                        }
                    }
                }
            }
        }).then(response => response?.hits?.hits[0]);
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

        const data = await page.evaluate(async (server, endpoint, headers, body) => {
            const url = new URL(`${server}${endpoint}`);

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
        }, server, endpoint, headers, customSchemaBody);

        await browser.close();
        expect(data.status).toEqual('success');

        const outputFileName = 'allowed-origin';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    }, 30000);

    test(`CORS Error (${CORS_NOT_ALLOWED_ORIGIN})`, async () => {
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

        const data = await page.evaluate(async (server, endpoint, headers, body) => {
            const url = new URL(`${server}${endpoint}`);

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
        }, server, endpoint, headers, customSchemaBody);

        await browser.close();
        expect(data).toEqual('TypeError: Failed to fetch');

        const outputFileName = 'cors-error';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    }, 30000);

    test(`Allowed Subdomains (${CORS_ALLOWED_SUBDOMAINS})`, async () => {
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

        const data = await page.evaluate(async (server, endpoint, headers, body) => {
            const url = new URL(`${server}${endpoint}`);

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
        }, server, endpoint, headers, customSchemaBody);

        await browser.close();
        expect(data.status).toEqual('success');

        const outputFileName = 'allowed-subdomains';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    }, 30000);

    test('Custom Event', async () => {
        const url = new URL(`${server}${endpoint}`);

        const response = await fetch(url, {
            method: 'post',
            headers,
            body: JSON.stringify(customSchemaBody)
        });

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText
            }
        }

        const data = await response.json();
        expect(data.status).toEqual('success');

        const outputFileName = 'custom-event';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    });
});