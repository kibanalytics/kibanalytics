const packageJson = require('../package.json');

module.exports.PROJECT_NAME = packageJson.name;
module.exports.PROJECT_HOMEPAGE = packageJson.homepage;
module.exports.VERSION = packageJson.version;