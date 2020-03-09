const SortDirection = {
    asc: 'asc',
    desc: 'desc'
};

const sortBy = ({ field, order = SortDirection.asc }, ...args) => (a, b) => {
    args.reduce((acc, cur) => {
        const { field, direction } = cur;
        if (
            !a.fieldLookup.hasOwnProperty(field) ||
            !b.fieldLookup.hasOwnProperty(field)
        ) {
            return 0;
        }

        let fieldA = a.fieldLookup[field];
        fieldA = typeof fieldA === 'string' ? fieldA.toUpperCase() : fieldA;

        let fieldB = b.fieldLookup[field];
        fieldB = typeof fieldB === 'string' ? fieldB.toUpperCase() : fieldB;

        let comparison = (fieldA > fieldB) - (fieldA < fieldB);
        comparison =
            direction === SortDirection.desc ? comparison * -1 : comparison;
        return acc || comparison;
    }, 0);
};

sortBy3 = function(arr, sortDirections) {
    const { field, direction } = sortDirections;
    var sortArguments = arguments;
    arr.sort(function(objA, objB) {
        var result = 0;
        for (
            var argIndex = 0;
            argIndex < sortArguments.length && result === 0;
            argIndex += 2
        ) {
            var field = sortArguments[argIndex];
            result =
                objA[field] < objB[field]
                    ? -1
                    : objA[field] > objB[field]
                    ? 1
                    : 0;

            //Reverse if sort order is false (DESC)
            result *= !sortArguments[argIndex + 1] ? 1 : -1;
        }
        return result;
    });
};

module.exports = { sortBy4, sortBy3, SortDirection };
