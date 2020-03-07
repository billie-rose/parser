const OrderedObject = require('./models/ordered-object');
const Property = require('./models/property');

/**
 * Creates a dataset of ordered objects given a chunk of data, a delimiter,
 * and a schema to follow.
 *
 * @method
 * @param {Buffer | Uint8Array | string | null | <any>} chunk
 * @param {string} delimiter
 * @param schema
 * @returns {Array<OrderedObject} data
 */
const parseData = (chunk, delimiter, schema) => {
    if (!chunk) {
        //TODO: error handling
    }

    const dataSet = [];
    let rows = chunk.split(/\n/) || [];
    rows.forEach(row => {
        let dataObj;

        const cols = row.split(delimiter);
        if (!schema || !schema.outputFieldMapping) {
            if (cols) {
                //TODO
            }
        } else if (cols && cols.length == schema.outputFieldMapping.length) {
            dataObj = new DataObject(
                schema.inputFieldMapping[delimiter].map(
                    field,
                    i => new Property(field, chunk[i], i)
                )
            );
            dataSet.push(dataObj);
        }
    });

    return dataSet;
};

module.exports = parseData;
