const SortDirection = {
    asc: 'asc',
    desc: 'desc'
};

const sortBy = ({ field, order = SortDirection.asc }, ...args) => (a, b) => {
    args.reduce((acc, cur) => {
        if (!a.hasOwnProperty(field) || !b.hasOwnProperty(field)) {
            return 0;
        }
        const fieldA =
            typeof a[field] === 'string' ? a[field].toUpperCase() : a[field];
        const fieldB =
            typeof b[field] === 'string' ? b[field].toUpperCase() : b[field];
        let comparison = (fieldA > fieldB) - (fieldA < fieldB);
        comparison =
            order === SortDirection.desc ? comparison * -1 : comparison;
        return acc || comparison;
    }, 0);
};

module.exports = { sortBy, SortDirection };
