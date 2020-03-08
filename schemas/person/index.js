const { inputFieldOrderByDelimiter, outputFieldOrder } = require('./config');
const person = require('./model');

/**
 * @type {{ model: any, delimeters: Array<string>, inputFieldOrder: {delimeter: string, value: Array<string>}, outputFieldOrder: Array<string> }}
 */
const personSchema = {
    model: person,
    delimeters: [Object.keys(inputFieldOrderByDelimiter)],
    sortedOutputs,
    inputFieldOrder: inputFieldOrderByDelimiter,
    outputFieldOrder
};

// We wouldn't normally need any of this. A simple JSON file with a
// generic schema parser would work, but the custom requirements of this
// project require adding this layer of functionality (namely, I wouldn't expect
// users to be able to define 3+ different ways of sorting output in one import,
// nor would I expect them to have differently delimeted files all in the same import folder)
// but here we are
module.exports = personSchema;
