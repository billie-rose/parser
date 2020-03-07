var { properties } = require('./model.json');

// Some janky reflection going on here to avoid using string literals so that we can order fields
// by their name the way we want to.
// Theoretically, users would want an import and output formatted in the same way (hence using a JSON array
// for properties), therefore this sort of thing wouldn't be needed. Theoretically.
const fields = {};
const propertyKeys = properties.map(property => Object.keys(property)).flat();
propertyKeys.forEach(fieldName => (fields[fieldName] = fieldName));

const {
    lastName,
    firstName,
    middleInitial,
    gender,
    favoriteColor,
    dob
} = fields;

const importFieldOrder = [
    lastName,
    firstName,
    middleInitial,
    gender,
    favoriteColor,
    dob
];

// If we do ever add new unmapped fields, we'll just append them onto our mappings
// in the order they appear in the json model
propertyKeys.map(field => {
    if (importFieldOrder.indexOf(field) < 0) {
        importFieldOrder.push(field);
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

const inputFieldMappingByDelimiter = {
    '|': pipeDelimitedFieldMapping,
    ',': commaDelimitedFieldMapping,
    ' ': spaceDelimitedFieldMapping
};

const outputFieldMapping = [lastName, firstName, gender, dob, favoriteColor];

function swapElements(arr, from, to) {
    var element = arr[from];
    arr.splice(from, 1);
    arr.splice(to, 0, element);
    return arr;
}

module.exports = {
    inputFieldMappingByDelimiter,
    outputFieldMapping
};
