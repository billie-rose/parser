const config = require('./config.json');

const dynamicConfig = {
    fileDir: `${__dirname}/examples`,
    outputDir: `${__dirname}`
};

// If this were a production app, we'd have different config setup
// for different environments, etc.
global.globalConfig = { ...config, ...dynamicConfig };
