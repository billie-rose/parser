const parse = require('./parse');
const help = require('./help');
const personSchema = require('../../schemas/person');

module.exports = ci;

function ci(commands = []) {
    switch (commands.length) {
        case 0:
            parse();
            break;
        case 1:
            commands[0] != 'parse' ? help() : parse();
            break;
        default:
        // handle options
    }
}
