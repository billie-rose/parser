const SortDirection = {
    asc: 'asc',
    desc: 'desc'
};

const sortBy = sortDirections => (a, b) => {
    return sortDirections.reduce((acc, cur) => {
        const { field, direction } = cur;
        if (
            !a.getFieldByName(field) ||
            a.getFieldByName(field).name !== field ||
            !b.getFieldByName(field) ||
            b.getFieldByName(field).name !== field
        ) {
            return 0;
        }

        let fieldA = a.getFieldByName(field).value;
        fieldA = typeof fieldA === 'string' ? fieldA.toUpperCase() : fieldA;
        fieldA = !isNaN(Date.parse(fieldA))
            ? new Date(fieldA).getTime()
            : fieldA;

        let fieldB = b.getFieldByName(field).value;
        fieldB = typeof fieldB === 'string' ? fieldB.toUpperCase() : fieldB;
        fieldB = !isNaN(Date.parse(fieldB))
            ? new Date(fieldB).getTime()
            : fieldB;

        let comparison = (fieldA > fieldB) - (fieldA < fieldB);
        comparison =
            direction === SortDirection.desc ? comparison * -1 : comparison;
        return acc || comparison;
    }, 0);
};

module.exports = { sortBy, SortDirection };
