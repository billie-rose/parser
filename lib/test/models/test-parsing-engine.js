const schema = require('../../../schemas/person');
const ParsingEngine = require('../../src/models/parsing-engine');

var assert = require('assert');

describe('ParsingEngine', function() {
    const input =
        'Abercrombie, Neil, Male, Tan, 2/13/1943\nBishop, Timothy, Male, Yellow, 4/23/1967\nKelly, Sue, Female, Pink, 7/12/1959\nSmith | Steve | D | M | Red | 3-3-1985\nBonk | Radek | S | M | Green | 6-3-1975\nBouillon | Francis | G | M | Blue | 6-3-1975\nKournikova Anna F F 6-3-1975 Red\nHingis Martina M F 4-2-1979 Green\nSeles Monica H F 12-2-1973 Black';
    const data = input.split('\n');
    const engine = new ParsingEngine(data, schema);

    describe('#getDelimeterFromRow()', function() {
        it('should return the correct delimeter for a row', function() {
            assert.equal(engine.getDelimeterFromRow(data[0]), ',');
            assert.equal(engine.getDelimeterFromRow(data[1]), ',');
            assert.equal(engine.getDelimeterFromRow(data[2]), ',');
            assert.equal(engine.getDelimeterFromRow(data[3]), '|');
            assert.equal(engine.getDelimeterFromRow(data[4]), '|');
            assert.equal(engine.getDelimeterFromRow(data[5]), '|');
            assert.equal(engine.getDelimeterFromRow(data[6]), ' ');
            assert.equal(engine.getDelimeterFromRow(data[7]), ' ');
            assert.equal(engine.getDelimeterFromRow(data[8]), ' ');
        });
    });

    describe('#parseToOutput()', function() {
        it('should parse the data formatted correctly', function() {
            const result = engine.parseToOutput('Output ${rowNumber}:');
            const expected = `Output 1:
Hingis Martina Female 4/2/1979 Green
Kelly Sue Female 7/12/1959 Pink
Kournikova Anna Female 6/3/1975 Red
Seles Monica Female 12/2/1973 Black
Abercrombie Neil Male 2/13/1943 Tan
Bishop Timothy Male 4/23/1967 Yellow
Bonk Radek Male 6/3/1975 Green
Bouillon Francis Male 6/3/1975 Blue
Smith Steve Male 3/3/1985 Red

Output 2:
Abercrombie Neil Male 2/13/1943 Tan
Kelly Sue Female 7/12/1959 Pink
Bishop Timothy Male 4/23/1967 Yellow
Seles Monica Female 12/2/1973 Black
Bonk Radek Male 6/3/1975 Green
Bouillon Francis Male 6/3/1975 Blue
Kournikova Anna Female 6/3/1975 Red
Hingis Martina Female 4/2/1979 Green
Smith Steve Male 3/3/1985 Red

Output 3:
Smith Steve Male 3/3/1985 Red
Seles Monica Female 12/2/1973 Black
Kournikova Anna Female 6/3/1975 Red
Kelly Sue Female 7/12/1959 Pink
Hingis Martina Female 4/2/1979 Green
Bouillon Francis Male 6/3/1975 Blue
Bonk Radek Male 6/3/1975 Green
Bishop Timothy Male 4/23/1967 Yellow
Abercrombie Neil Male 2/13/1943 Tan
`;
            assert.equal(result, expected);
        });
    });

    describe('#parseData()', function() {
        it('should parse the data correctly', function() {
            const data = `Abercrombie, Neil, Male, Tan, 2/13/1943
Bishop, Timothy, Male, Yellow, 4/23/1967
Kelly, Sue, Female, Pink, 7/12/1959`.split('\n');

            const pe = new ParsingEngine(data, schema);
            const pdat = pe.parseData();
            pdat.map(row => {
                schema.inputFieldOrderByDelimiter[','].forEach(
                    (fieldName, i) => {
                        assert.equal(row.fields[i].name, fieldName);
                    }
                );
            });
        });
    });
});
