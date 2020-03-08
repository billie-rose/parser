/**
 * @class OrderedField
 * @classdesc A sortable field with a name, value, and (optional) type
 * @field {string} this.name
 * @field {string} this.value
 * @field {number} this.value
 */
class OrderedField {
    /**
     * @name OrderedField#name
     * @type {string}
     */
    name;

    /**
     * @name OrderedField#value
     * @type {string}
     */
    value;

    /**
     * @name OrderedField#order
     * @type {number}
     */
    order;

    /**
     * @name OrderedField#type
     * @type {string}
     */
    type;

    /**
     * @param {string} name
     * @param {string} value
     * @param {number} order
     * @param {string} type
     */
    constructor(name, value, order, type) {
        this.name = name;
        this.value = value;
        this.order = order;
        this.type = type;
    }
}

module.exports = OrderedField;
