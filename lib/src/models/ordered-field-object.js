const Field = require('./field');
const { generateGuid } = require('../util');

/**
 * @class OrderedFieldObject
 * @classdesc An object whose fields have order
 * @field {string} guid
 * @field {Array<Field>} fields
 */
class OrderedFieldObject {
    /** * @type {string} unique identifier */
    _guid;
    /**  @type {Array<Field>} A sorted, distinct array of fields  */
    fields = [];
    fieldLookup = {};
    delimeter;

    /** @param {Array<Field>} fields */
    setFields(fields) {
        this.fields = fields;
    }
    /** @returns {Array<Field>} */
    getFields() {
        return this.fields;
    }

    /** @returns {string} */
    getGuid() {
        return this.guid;
    }

    getFieldByName(fieldName) {
        if (!this.fieldLookup) {
            this.fields.forEach(field => {
                this.fieldLookup[field.name] = field;
            });
        }
        return this.fieldLookup[fieldName];
    }

    /**
     * @param {Array<Field>} fields
     */
    constructor(fields, delimeter, guid) {
        this.fields = fields;

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
