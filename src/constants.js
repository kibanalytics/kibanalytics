const packageJson = require('../package.json');

module.exports.EXPRESS_PORT = 3000;
module.exports.PROJECT_NAME = packageJson.name;
module.exports.PROJECT_HOMEPAGE = packageJson.homepage;
module.exports.VERSION = packageJson.version;