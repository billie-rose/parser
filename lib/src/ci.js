import parse from './parse';
import help from './help';
import personSchema from '../../schemas/person';

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
