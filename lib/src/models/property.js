/**
 * @class Property
 * @classdesc A sortable field with a name, value, and (optional) type
 * @property {string} this.name
 * @property {string} this.value
 * @property {number} this.value
 */
class Property {
    /**
     * @name Property#name
     * @type {string}
     */
    name;

    /**
     * @name Property#value
     * @type {string}
     */
    value;

    /**
     * @name Property#order
     * @type {number}
     */
    order;

    /**
     * @name Property#type
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

module.exports = Property;
