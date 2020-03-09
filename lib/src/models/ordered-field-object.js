const OrderedField = require('./ordered-field');
const { generateGuid } = require('../util');

/**
 * @class OrderedFieldObject
 * @classdesc An object whose fields have order
 * @field {string} guid
 * @field {Array<OrderedField>} fields
 */
class OrderedFieldObject {
    /** * @type {string} unique identifier */
    _guid;

    /**  @type {Array<OrderedField>} A sorted, distinct array of fields  */
    fields = [];

    fieldLookup = {};

    delimeter;

    /** @param {Array<OrderedField>} fields */
    setOrderedFields(fields) {
        this.fields = fields;
    }
    /** @returns {Array<OrderedField>} */
    getOrderedFields() {
        return this.fields;
    }

    /** @returns {string} */
    getGuid() {
        return this.guid;
    }

    /**
     * @param {Array<OrderedField>} fields
     */
    constructor(fields, delimeter, guid) {
        const fieldSet = new Set();
        this.fields = fields
            .filter(field => {
                const duplicate = fieldSet.has(field.name);
                fieldSet.add(field.name);
                return !duplicate;
            })
            .sort();

        this.fields.forEach(field => {
            this.fieldLookup[field.name] = field;
        });

        this.delimeter = delimeter;

        /** @type {string} unique identifier */
        this._guid = guid || generateGuid();
    }

    /**
     * @param delimeter : string, defaulted to space
     * @returns {string} a delimited string of fields for the object
     */
    toDelimitedString(toDelimeter) {
        if (!this.fields) return;

        const str = this.fields
            .map(field => field.value.trim())
            .join(toDelimeter || this.delimeter || this.Delimeter.space);

        return str;
    }
}

OrderedFieldObject.Delimeter = {
    comma: ',',
    pipe: '|',
    space: ' '
};

module.exports = OrderedFieldObject;
