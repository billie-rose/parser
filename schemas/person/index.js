const person = {
    firstName: { type: 'string' },
    middleInitial: { type: 'string' },
    lastName: { type: 'string' },
    gender: { type: 'string' },
    favoriteColor: { type: 'string' },
    dob: { type: 'date' }
};

// Some fields are intentionally marked false as they are not needed in the output
const defaultInputFieldOrder = [
    [person.lastName],
    [person.firstName],
    [person.middleInitial],
    [person.gender],
    [person.favoriteColor],
    [person.dob]
];

const pipeDelimitedFieldMapping = {
    fieldOrder: defaultInputFieldOrder
};

const commaDelimitedFieldMapping = {
    fieldOrder: [...defaultInputFieldOrder].splice(2, 1) // remove middle initial
};

const spaceDelimitedFieldMapping = {
    fieldOrder: swapElements([...defaultInputFieldOrder], 4, 5) // swap favoiteColor w/ dob
};

const inputFieldMappingByDelimiter = {
    '|': pipeDelimitedFieldMapping,
    ',': commaDelimitedFieldMapping,
    ' ': spaceDelimitedFieldMapping
};

const outputFieldMapping = [
    [person.lastName],
    [person.firstName],
    [person.gender],
    [person.dob],
    [person.favoriteColor]
];

function swapElements(arr, from, to) {
    var element = arr[from];
    arr.splice(from, 1);
    arr.splice(to, 0, element);
    return arr;
}

module.exports = {
    model: person,
    inputFieldMappingByDelimiter,
    outputFieldMapping
};
