const fs = require('fs');
const path = require('path');

/*
    plugins can access the shared data context on req.data property
 */
const plugins = [];

const folderContent = fs.readdirSync(__dirname);
for (const entry of folderContent) {
    if (entry.endsWith('.plugin.js')) {
        const plugin = require(path.join(__dirname, entry));
        plugins.push(plugin);
    }
}

module.exports = plugins;