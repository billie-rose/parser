const crypto = require('crypto');

const generateGuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
    );
};

// This is bad and I feel bad but would normally do this sort of thing
// using moment
const formatDate = function(str) {
    const date = new Date(str);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

module.exports = { generateGuid, formatDate };
