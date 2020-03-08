const OrderedFieldObject = require('./ordered-field-object');
const OrderedField = require('./ordered-field');
const { sortBy } = require('../util/sorter-util');
const ParsedData = require('./parsed-data');

class ParsingEngine {
    _hasSchemaFields;
    _hasSchemaFieldOrder;
    lines;
    schema;

    constructor(lines, schema = undefined) {
        this.lines = lines;
        this.schema = schema;
        this._hasSchemaFields =
            schema && schema.fields && schema.fields.length > 0;
        this._hasSchemaFieldOrder =
            schema &&
            schema.inputFieldOrderByDelimiter &&
            schema.inputFieldOrderByDelimiter.length > 0;
    }

    parseToOutput(headerTemplate = '') {
        const dataArr = this.parseData();
        if (!dataArr) return undefined;

        const sortedDataArr = [];
        if (this.schema && this.schema.sortDirections) {
            this.schema.sortDirections.forEach(sortDirection => {
                const sortedCopy = [...dataArr];
                this.sortData(sortedCopy, sortDirection);
                sortedDataArr.push(sortedCopy);
            });
        } else {
            sortedDataArr.push(dataArr);
        }

        const output = sortedDataArr
            .map((sortedData, index) => {
                let str = new ParsedData(sortedData, () => ({
                    headerTemplate,
                    args: { rowNumber: index + 1 }
                })).getFormattedData();

                // Add some extra spacing around everything but the first and last output
                // We could make this formattable like the header if we wanted to get fancy
                if (index + 1 !== sortedData.length) {
                    str = str.concat('\n');
                }

                return str;
            })
            .join('\n');
        return output;
    }

    parseData() {
        if (!this.lines) return undefined;

        let rows = this.lines.toString().split('\n');

        console.log(rows);
        return rows.map(row => {
            const delimeter = this.getDelimeterFromRow(row);
            let fields = row.split(delimeter);

            if (this._hasSchemaFields) {
                fields = this._hasSchemaFieldOrder
                    ? this.schema.inputFieldOrderByDelimiter[delimeter]
                    : this.schema.fields;
                return new OrderedFieldObject(
                    this.schema.inputFieldOrderByDelimiter[delimeter].map(
                        (fieldName, index) =>
                            new OrderedField(fieldName, fields[index], index)
                    )
                );
            }

            // Anonymous fields
            return new OrderedFieldObject(
                fields.map(
                    (value, index) => new OrderedField(index, value, index)
                )
            );
        });
    }

    sortData(dataArr, sortDirections) {
        if (!dataArr || !dataArr.length > 0) return dataArr;

        if (!(dataArr[0] instanceof OrderedFieldObject))
            throw `Err! Expected ${
                OrderedObject.name
            }[], instead got ${typeof dataArr[0]}[]!`;

        dataArr.sort(sortBy(sortDirections));
    }

    getDelimeterFromRow(row) {
        if (!row) return undefined;
        // Process the delimeter from the row of text, favoring the other delimeters before space
        return Object.keys(OrderedFieldObject.Delimeter).reduce((acc, curr) => {
            const currDelimPos = row.indexOf(curr);
            const prevDelimPos = row.indexOf(acc);
            return currDelimPos < prevDelimPos ? curr : acc;
        }, OrderedFieldObject.Delimeter.space);
    }
}

module.exports = ParsingEngine;
