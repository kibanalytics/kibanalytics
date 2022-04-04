const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const SCHEMAS_FOLDER_NAME = 'schemas';

const ajv = new Ajv();
require('ajv-keywords')(ajv);

const folderContent = fs.readdirSync(path.join(__dirname, SCHEMAS_FOLDER_NAME, 'events'));
for (const entry of folderContent) {
    if (entry.endsWith('.schema.js')) {
        const schemaKey = entry.replace('.schema.js', '');
        const schema = require(path.join(__dirname, SCHEMAS_FOLDER_NAME, 'events', entry));
        ajv.addSchema(schema, schemaKey);
    }
}

// @TODO this is ugly and not elegant
const collectEndpointSchemaKey = 'collectEndpoint';
const collectEndpointSchema = require('./schemas/endpoints/collect.schema.js');
ajv.addSchema(collectEndpointSchema, collectEndpointSchemaKey);

module.exports = ajv;