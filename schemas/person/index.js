const { inputFieldOrderByDelimiter, outputFieldOrder } = require('./config');
const person = require('./model');

/**
 * @type {{ model: any, delimeters: Array<string>, inputFieldOrder: {delimeter: string, value: Array<string>}, outputFieldOrder: Array<string> }}
 */
const personSchema = {
    model: person,
    delimeters: [Object.keys(inputFieldOrderByDelimiter)],
    inputFieldOrder: inputFieldOrderByDelimiter,
    outputFieldOrder
};

// We wouldn't normally need any of this. A simple JSON file would work
// assuming a workflow where files are imported and exported in the same order
// and with only one delimeter.
module.exports = personSchema;
