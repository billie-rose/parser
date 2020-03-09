var { fields, sortDirections } = require('./model.json');

/**
 * Some quick reflection going on here to avoid using string literals.
 * We're doing it this way so that we can order some fields the way we want to,
 * without needing to account for any others which may be added later
 */
const fieldNames = {};

// Get the string literals for the fields (fields) defined in our json model
const fieldKeys = fields.map(field => Object.keys(field)).flat();
fieldKeys.forEach(fieldName => (fieldNames[fieldName] = fieldName));
const { lastName, firstName, middleInitial, gender, favoriteColor, dob } = fieldNames; // prettier-ignore

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

// If we ever want to add new fields, we can just add them to the json file
fieldKeys.map(field => {
    if (importFieldOrder.indexOf(field) < 0) {
        importFieldOrder.push(field);
        outputFieldOrder.push(field);
    }
});

// LastName | FirstName | MiddleInitial | Gender | FavoriteColor | DateOfBirth
const pipeDelimitedFieldMapping = [...importFieldOrder];

// LastName, FirstName, Gender, FavoriteColor, DateOfBirth
const commaDelimitedFieldMapping = [...importFieldOrder].filter(
    // Remove MiddleInitial
    field => field != middleInitial
);

// LastName FirstName MiddleInitial Gender DateOfBirth FavoriteColor
const spaceDelimitedFieldMapping =
    // swap order of FavoriteColor w/ DateOfBirth
    swapElements(
        [...importFieldOrder],
        importFieldOrder.indexOf(favoriteColor),
        importFieldOrder.indexOf(dob)
    );

/**
 * Lookup for the order of fields for this schema from an import
 * The field order may change based on how the data is delimited (why? idk, probably to be mean)
 * @type {{ delimeter: string, value: Array<string> }}
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
    outputFieldOrder,
    sortDirections
};
