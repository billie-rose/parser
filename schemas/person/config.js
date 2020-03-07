var { properties } = require('./model.json');

/**
 * Some quick reflection going on here to avoid using string literals.
 * We're doing it this way so that we can order some fields the way we want to,
 * without needing to account any others which may be added later
 */
const fields = {};

// Get the string literals for the properties (fields) defined in our json model
const propertyKeys = properties.map(property => Object.keys(property)).flat();
propertyKeys.forEach(fieldName => (fields[fieldName] = fieldName));
const { lastName, firstName, middleInitial, gender, favoriteColor, dob } = fields; // prettier-ignore

/**
 * @type {Array<string>}
 * The default order that fields of this schema are imported
 */
const importFieldOrder = [
    lastName,
    firstName,
    middleInitial,
    gender,
    favoriteColor,
    dob
];

/**
 * @type {Array<string>}
 * The order that fields of this schema are exported
 */
const outputFieldOrder = [lastName, firstName, gender, dob, favoriteColor];

// If we do ever add new fields, we'll just append them onto our mappings in the order
// they appear in the json model
propertyKeys.map(field => {
    if (importFieldOrder.indexOf(field) < 0) {
        importFieldOrder.push(field);
        outputFieldOrder.push(field);
    }
});

// LastName | FirstName | MiddleInitial | Gender | FavoriteColor | DateOfBirth
const pipeDelimitedFieldMapping = {
    fieldOrder: importFieldOrder
};

// LastName, FirstName, Gender, FavoriteColor, DateOfBirth
const commaDelimitedFieldMapping = {
    // remove MiddleInitial
    fieldOrder: [...importFieldOrder].filter(field => field != middleInitial)
};

// LastName FirstName MiddleInitial Gender DateOfBirth FavoriteColor
const spaceDelimitedFieldMapping = {
    // swap order of FavoriteColor w/ DateOfBirth
    fieldOrder: swapElements(
        [...importFieldOrder],
        importFieldOrder.indexOf(favoriteColor),
        importFieldOrder.indexOf(dob)
    )
};

/**
 * Lookup for the order in which fields for a schema should be parsed from data.
 * The field order may change based on how the data is delimeted
 * @type {{ delimeter: string, fieldMapping: Array<string> }}
 */
const inputFieldOrderByDelimiter = {
    // We're assuming that the delimeter will always be a string, I'd prefer not to
    // imagine what we'd have to do otherwise.
    '|': pipeDelimitedFieldMapping,
    ',': commaDelimitedFieldMapping,
    ' ': spaceDelimitedFieldMapping
};

function swapElements(arr, from, to) {
    var element = arr[from];
    arr.splice(from, 1);
    arr.splice(to, 0, element);
    return arr;
}

module.exports = {
    inputFieldOrderByDelimiter,
    outputFieldOrder
};
