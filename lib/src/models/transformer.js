const util = require('util');
const { Transform } = require('stream');

function Transformer(options) {
    Transform.call(this, options);
}
util.inherits(Transformer, Transform);

module.exports = Transformer;
