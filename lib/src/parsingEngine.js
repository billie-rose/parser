const OrderedObject = require('./models/ordered-object');
const Property = require('./models/property');

/**
 * Creates a dataset of ordered objects given a chunk of data, a delimiter,
 * and a schema to follow.
 *
 * @param {Buffer | Uint8Array | string | null | <any>} chunk
 * @param {string} delimiter
 * @param schema
 * @returns {Array<OrderedObject} data
 */
const parseData = (chunk, delimiter, schema) => {
    let rows = chunk?.split(/\n/) || [];
    if (!chunk) {
        //TODO: error handling
    }

    const dataSet = [];
    rows.forEach(row => {
        const cols = row.split(delimiter);
        if (cols?.length != schema?.outputFieldMapping?.length) {
            //TODO: error handling
        }

        //TODO: date parsing
        const dataObj = new OrderedObject();
        dataObj.properties = schema.inputFieldMapping[delimiter].map(
            field,
            i => new Property(field, chunk[i], i)
        );
        dataSet.push(dataObj);
    });

    return dataSet;
};

module.exports = parseData;
