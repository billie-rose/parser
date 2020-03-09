const OrderedFieldObject = require('./ordered-field-object');
const OrderedField = require('./ordered-field');
const { sortBy } = require('../util/sorter-util');
const { formatDate } = require('../util');
const ParsedData = require('./parsed-data');
const config = require('../config');

class ParsingEngine {
    _hasSchemaFields;
    _hasSchemaFieldOrder;
    _hasSchemaOutputFieldOrder;
    rows;
    schema;

    constructor(rows, schema = undefined) {
        this.rows = rows;
        this.schema = schema;
        this._hasSchemaFields =
            schema &&
            schema.model &&
            schema.model.fields &&
            schema.model.fields.length > 0;
        this._hasSchemaFieldOrder = schema && schema.inputFieldOrderByDelimiter;
        this._hasSchemaOutputFieldOrder = schema && schema.outputFieldOrder;
    }

    parseToOutput(headerTemplate = '') {
        const dataArr = this.parseData();
        if (!dataArr) return undefined;

        const sortedDataArr = this.sortData(dataArr);
        const output = sortedDataArr
            .map((data, index) => {
                this.rearrangeFieldOrderForOutput(data);
                const parsedData = new ParsedData(data, () => ({
                    headerTemplate,
                    args: { rowNumber: index + 1 }
                }));
                let str = parsedData.getFormattedData();

                // Add some extra spacing around everything but the first and last output
                // We could make this formattable like the header if we wanted to get fancy
                if (index + 1 !== data.length) {
                    str = str.concat('\n');
                }
                return str;
            }, this)
            .join('\n');

        return output;
    }

    parseData() {
        if (!this.rows) return undefined;
        return this.rows.map(row => {
            const delimeter = this.getDelimeterFromRow(row);
            let fields = row.trim().split(delimeter);

            if (this._hasSchemaFields) {
                const fieldOrder = this._hasSchemaFieldOrder
                    ? this.schema.inputFieldOrderByDelimiter[delimeter]
                    : this.schema.fields;

                return new OrderedFieldObject(
                    fieldOrder.map((fieldName, index) => {
                        return new OrderedField(
                            fieldName,
                            this.getStandardizedField(fieldName, fields[index]),
                            fields[index],
                            index
                        );
                    }, this),
                    delimeter
                );
            }

            // We weren't provided a schema
            return new OrderedFieldObject(
                fields.map(
                    (value, index) => new OrderedField(index, value, index)
                ),
                this,
                delimeter
            );
        }, this);
    }

    getStandardizedField(fieldName, value) {
        if (!fieldName || !value) return value;
        value = value.trim();

        const { dataFormat } = global.globalConfig;
        if (!dataFormat[fieldName]) return value;

        const date = Date.parse(value);
        if (!isNaN(date)) {
            return formatDate(date);
        }

        if (fieldName === 'gender') {
            let genders = dataFormat[fieldName].format;

            for (let i = 0; i < genders.length; i++) {
                if (
                    // Making the assumption that the literal english
                    // words for male/female aren't changing anytime soon
                    // This'll fail on bit input but....who does that?
                    genders[i].charAt(0).toUpperCase() ==
                    value.charAt(0).toUpperCase()
                ) {
                    return genders[i];
                }
            }
        }

        return value;
    }

    sortData(dataArr) {
        if (!dataArr || !dataArr.length > 0) return dataArr;

        if (!(dataArr[0] instanceof OrderedFieldObject))
            throw `Err! Expected ${
                OrderedObject.name
            }[], instead got ${typeof dataArr[0]}[]!`;

        const sortedDataArr = [];
        if (this.schema && this.schema.sortDirections) {
            this.schema.sortDirections.map(sort => {
                const copy = [...dataArr];
                copy.sort(sortBy(sort));
                sortedDataArr.push(copy);
            });
        } else {
            sortedDataArr.push(dataArr);
        }

        return sortedDataArr;
    }

    rearrangeFieldOrderForOutput(data) {
        if (!this._hasSchemaOutputFieldOrder) return data;
        data.forEach(row => {
            const newlyOrderedFields = [];
            this.schema.outputFieldOrder.map(field => {
                newlyOrderedFields.push(row.fieldLookup[field]);
            });
            row.fields = newlyOrderedFields;
        });
    }

    getDelimeterFromRow(row) {
        if (!row) return undefined;
        // Process the delimeter from the row of text, favoring the other delimeters before space
        // I'm totally sure there's a better way of doing while still keeping the delims
        // dynamic, but my brain is seriously fried at the moment
        const indexOfDelimeter = Object.values(OrderedFieldObject.Delimeter)
            .filter(delims => delims !== OrderedFieldObject.Delimeter.space)
            .reduce((acc, curr) => {
                const currDelimPos = row.indexOf(curr);
                const prevDelimPos = acc;
                if (prevDelimPos < 0) return currDelimPos;
                if (currDelimPos < 0) return prevDelimPos;
                if (currDelimPos < prevDelimPos) return currDelimPos;
                return prevDelimPos;
            }, -1);

        if (indexOfDelimeter < 0) return OrderedFieldObject.Delimeter.space;
        return row[indexOfDelimeter];
    }
}

module.exports = ParsingEngine;
