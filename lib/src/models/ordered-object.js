const Property = require('./property');

/**
 * @class OrderedObject
 * @classdesc An object whose fields have order
 * @property {Array<Property>} properties
 */
class OrderedObject {
    /**
     * A sorted, distinct array of properties
     * @type {Array<Property>}
     */
    properties;

    /** @param {Array<Property>} properties */
    setProperties = properties => (this.properties = properties);

    /** @returns {Array<Property>} */
    getProperties = () => this.properties;

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
    }

    /**
     * @param delimeter : string, defaulted to space
     * @returns {string} a delimited string of properties for the object
     */
    toString = (delimeter = ' ') => properties.join(delimeter);
}

module.exports = OrderedObject;
