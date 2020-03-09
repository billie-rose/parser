const {
    sortDirections,
    inputFieldOrderByDelimiter,
    outputFieldOrder
} = require('./config');
const person = require('./model');

/**
 * This is a special case where we have a lot of unique things we want to do
 * for this schema...ideally we wouldn't need to do this type of thing for
 * any other type of schema, since we would assume that users are
 * importing/exporting data in the same way with the same delim each time.
 *
 * We would want to create some sort of schema base object to do process more
 * types of schemas for us in the future, if really needed
 *
 * @type {{ model: any, delimeters: Array<string>, inputFieldOrderByDelimiter: {delimeter: string, value: Array<string>},
 * sortDirections: Array<{field:string, direction:string}>, outputFieldOrder: Array<string> }}
 */
const personSchema = {
    model: person,
    delimeters: [Object.keys(inputFieldOrderByDelimiter)],
    sortDirections,
    inputFieldOrderByDelimiter,
    outputFieldOrder
};

module.exports = personSchema;
