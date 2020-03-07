var parse = require('./parse');
var help = require('./help');
const Person = require('../src/models/person');

module.exports = ci;

function ci(commands = []) {
    let person = new Person('meh');
    person.firstName = 'Test';

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
