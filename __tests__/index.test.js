require('dotenv').config();

const { existsSync, mkdirSync } = require('fs');
const { writeFile } = require('fs/promises');
const path = require('path');
const fetch = require('node-fetch');

const OUTPUT_DIR_PATH = path.join(process.cwd(), '__tests__', 'output');

if (!existsSync(OUTPUT_DIR_PATH)) {
    mkdirSync(OUTPUT_DIR_PATH);
    console.log(`Output folder created at path ${OUTPUT_DIR_PATH}`);
}

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

describe('Collect Controller', () => {
    const server = `http://localhost:${process.env.EXPRESS_PORT}`;
    const endpoint = '/collect'

    const headers = {
        'content-type': 'application/json'
    };

    test('Custom event', async () => {
        const url = new URL(`${server}${endpoint}`);
        const body = { type: 'custom', payload: { foo: 'bar' } };

        const response = await fetch(url, {
            method: 'post',
            headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw {
                status: response.status,
                statusText: response.statusText
            }
        }

        const data = await response.json();
        expect(data.status).toEqual('success');

        const outputFileName = 'collect-data';
        const outputFilePath = path.join(OUTPUT_DIR_PATH, `${outputFileName}.test.json`);
        await writeFile(outputFilePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Response saved at path ${outputFilePath}`);
    });
});