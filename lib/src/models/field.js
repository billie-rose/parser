/**
 * @class Field
 * @classdesc A sortable field with a name, value, and (optional) type
 * @field {string} this.name
 * @field {string} this.value
 * @field {number} this.value
 */
class Field {
    /**
     * @name Field#name
     * @type {string}
     */
    name;

    /**
     * @name Field#value
     * @type {string}
     */
    value;

    /**
     * @name Field#type
     * @type {string}
     */
    type;

    /**
     * @param {string} name
     * @param {string} value
     * @param {string} type
     */
    constructor(name, value, order, type) {
        this.name = name;
        this.value = value;
        this.type = type;
    }
}

module.exports = Field;
