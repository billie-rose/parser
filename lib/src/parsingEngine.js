const OrderedObject = require('./models/ordered-object');
const Property = require('./models/property');
const sorterUtil = require('./util/sorter-util');
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
const parseData = (lines, schema) => {
    let rows = lines.toString().split('\n');
    rows.pop(); // discard EOF
    console.log(rows);
    return rows.map(row => {
        let i = 0;
        const charArray = Array.from(row);
        while (i < charArray.length) {
            if (charArray[i] == '|') break;
            if (charArray[i] == ',') break;
            i++;
        }
        const delimeter = charArray[i] !== ('|' || ',') ? ' ' : charArray[i];
        const fields = row.split(delimeter);
        const obj = new OrderedObject(
            schema.inputFieldOrder[delimeter].map(
                (fieldName, index) =>
                    new Property(fieldName, fields[index], index)
            )
        );

        return obj;
    });
};

Object.defineProperty(Array.prototype, 'getSerializedSortedData', {
    value: function(order) {
        if (!this || !this.length > 0 || this[0] !== typeof OrderedObject)
            return this;
        return this.sort(sorterUtil(this.getSortByOrder(order)));
    }
});

module.exports = parseData;
