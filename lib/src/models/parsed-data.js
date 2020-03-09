const OrderedFieldObject = require('./ordered-field-object');

class ParsedData {
    formattedData;
    header;
    dataArr;

    getHeader() {
        return this.header;
    }

    setHeader(header) {
        this.header = header;
    }

    getDataArr() {
        return this.dataArr;
    }

    setDataArr(dataArr) {
        this.dataArr = dataArr;
    }

    getFormattedData() {
        return this.formatedData;
    }

    setFormattedData(formatedData) {
        this.formattedData = formatedData;
    }

    constructor(dataArr, getHeaderTemplate = () => ({ headerTemplate, args })) {
        this.dataArr = dataArr;
        if (getHeaderTemplate && typeof getHeaderTemplate === 'function') {
            const { headerTemplate, args } = getHeaderTemplate();
            this.header = this.formatHeader(headerTemplate, args);
        }
        this.formatedData = this.formatData(this.dataArr, this.header);
    }

    formatHeader(headerTemplate, args) {
        return new Function(
            'const {' +
                Object.keys(args).join(',') +
                '} = this.args;return `' +
                headerTemplate +
                '`'
        ).call({ args });
    }

    formatData(dataArr, header = '') {
        if (!dataArr) return undefined;
        if (dataArr.length > 0 && !(dataArr[0] instanceof OrderedFieldObject)) {
            throw `Err! Expected ${
                OrderedObject.name
            }[], instead got ${typeof dataArr[0]}[]!`;
        }

        const formattedHeader = header ? `${header}\n` : '';

        return formattedHeader.concat(
            dataArr
                .map(data => {
                    // Default to space but this could be made more flexible later
                    return data.toDelimitedString(
                        OrderedFieldObject.Delimeter.space
                    );
                })
                .join('\n')
        );
    }
}

module.exports = ParsedData;
