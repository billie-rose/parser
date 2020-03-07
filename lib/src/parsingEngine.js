const OrderedObject = require('./models/ordered-object');
const Property = require('./models/property');

/**
 * Creates a dataset of ordered objects given a chunk of data, a delimeter,
 * and a schema to follow.
 *
 * @method
 * @param {Buffer | Uint8Array | string | null | <any>} chunk
 * @param {string} delimeter
 * @param {{ model: any, delimeters: Array<string>, inputFieldOrder: {delimeter: string, fieldMappings: Array<string>}, outputFieldOrder: Array<string> }} schema
 * @returns {Array<OrderedObject>} data
 */
const parseData = (chunk, delimeter, schema) => {
    if (!chunk) {
        //TODO: error handling
    }
    const dataSet = [];
    let rows = chunk.split(/\n/) || [];
    rows.forEach(row => {
        let dataObj;

        const cols = row.split(delimeter);
        if (cols) {
            dataObj = new OrderedObject(
                schema.inputFieldOrder[delimeter].map(
                    (field, i) => new Property(field, cols[i], i)
                )
            );
            dataSet.push(dataObj);
        }
    });
    return dataSet;
};

module.exports = parseData;
