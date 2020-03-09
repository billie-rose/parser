/**
 * @class Field
 * @classdesc A field with a name and value
 * @property {string} this.name
 * @property {string} this.value
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
     * @param {string} name
     * @param {string} value
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

module.exports = Field;
