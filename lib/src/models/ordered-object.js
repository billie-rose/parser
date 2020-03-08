const Property = require('./property');
const crypto = require('crypto');

/**
 * @class OrderedObject
 * @classdesc An object whose properties have order
 * @property {string} guid
 * @property {Array<Property>} properties
 */
class OrderedObject {
    /** * @type {string} unique identifier */
    _guid;

    /**  @type {Array<Property>} A sorted, distinct array of properties  */
    properties = [];

    /**  @type {Array<Property>} A sorted, distinct array of properties  */
    sortBy = [];

    /** @param {Array<Property>} properties */
    setProperties(properties) {
        this.properties = properties;
    }
    /** @returns {Array<Property>} */
    getProperties() {
        return this.properties;
    }

    /** @returns {string} */
    getGuid() {
        return this.guid;
    }

    setSortBy(sortDefinitions) {
        this.sortBy = sortDefinitions;
    }

    getSortBy() {
        return this.sortBy;
    }

    getSortByOrder(order) {
        if (this.sortBy.length.indexOf(order) > -1) return this.sortBy[0];
        return undefined;
    }

    /**
     * @param {Array<Property>} properties
     */
    constructor(properties, sortBy) {
        const propertySet = new Set();
        this.properties = properties
            .filter(property => {
                const duplicate = propertySet.has(property.name);
                propertySet.add(property.name);
                return !duplicate;
            })
            .sort();
        this.sortBy = sortBy;

        /**
         * @type {string} unique identifier
         */
        this._guid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
        );
    }

    /**
     * @param delimeter : string, defaulted to space
     * @returns {string} a delimited string of properties for the object
     */
    toDelimitedString(delimeter = ' ') {
        if (!this.properties) return;
        return this.properties.map(property => property.value).join(delimeter);
    }
}

module.exports = OrderedObject;
