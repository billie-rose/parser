#!/usr/bin/env node
const parse = require('../lib/src/cli/parse');
const help = require('../lib/src/cli/help');
const config = require('../lib/src/config');

ci = (commands = []) => {
    switch (commands.length) {
        case 0:
            parse();
            break;
        case 1:
            commands[0] != 'parse' ? help() : parse();
            break;
        default:
        //TODO: Eventual handling of other options as specified in commands.js
    }
};

ci(process.argv.slice(2));
return;
