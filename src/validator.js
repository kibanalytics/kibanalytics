const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const SCHEMAS_FOLDER_NAME = 'schemas';

const ajv = new Ajv();

const folderContent = fs.readdirSync(path.join(__dirname, SCHEMAS_FOLDER_NAME));
for (const entry of folderContent) {
    if (entry.endsWith('.schema.js')) {
        const schemaKey = entry.replace('.schema.js', '');
        const schema = require(path.join(__dirname, SCHEMAS_FOLDER_NAME, entry));
        ajv.addSchema(schema, schemaKey);
    }
}

module.exports = ajv;