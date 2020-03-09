const config = require('./config.json');

const dynamicConfig = {
    inputDir: process.cwd() + '/examples',
    exportPath: process.cwd() + '/exports/export.txt'
};

// If this were a production app, we'd have different config setup
// for different environments, etc.
global.globalConfig = { ...config, ...dynamicConfig };
