var {
    person,
    inputFieldMappingByDelimiter,
    outputFieldMapping
} = require('./config');

// This is a more complicated example of a schema due to the delimiter reqs
// Our parser would work with only a json file
const personSchema = {
    model: person,
    delimeters: [Object.keys(inputFieldMappingByDelimiter)],
    inputFieldMapping: inputFieldMappingByDelimiter,
    outputFieldMapping
};

console.log(personSchema);

module.exports = personSchema;
