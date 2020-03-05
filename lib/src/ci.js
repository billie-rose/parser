var parse = require("./parse");
var help = require("./help");

module.exports = ci;

function ci(commands = []) {
    switch (commands.length) {
        case 0:
            parse();
            break;
        case 1:
            commands[0] != "parse" ? help() : parse();
            break;
        default:
        // handle options
    }
}
