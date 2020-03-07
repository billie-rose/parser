const Property = require('./property');
const crypto = require('crypto');

/**
 * @class OrderedObject
 * @classdesc An object whose fields have order
 * @property {string} guid
 * @property {Array<Property>} properties
 */
class OrderedObject {
    /** * @type {string} unique identifier */
    _guid;

    /**  @type {Array<Property>} A sorted, distinct array of properties  */
    properties = [];

    /** @param {Array<Property>} properties */
    setProperties = properties => (this.properties = properties);

    /** @returns {Array<Property>} */
    getProperties = () => this.properties;

    /** @returns {string} */
    getGuid = () => this.guid;

    /**
     * @param {Array<Property>} properties
     */
    constructor(properties) {
        this.properties = properties
            .filter(el => {
                const duplicate = seen.has(el.name);
                seen.add(el.name);
                return !duplicate;
            })
            .sort();

        /**
         * @type {string} unique identifier
         */
        this._guid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (
                c ^
                (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
    }

    /**
     * @param delimeter : string, defaulted to space
     * @returns {string} a delimited string of properties for the object
     */
    toString = (delimeter = ' ') => properties.join(delimeter);
}

module.exports = OrderedObject;
