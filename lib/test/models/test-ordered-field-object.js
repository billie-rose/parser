const OrderedFieldObject = require('../../src/models/ordered-field-object');
const Field = require('../../src/models/field');
var assert = require('assert');

describe('OrderedFieldObject', function() {
    describe('#toDelimitedString()', function() {
        it("should return a delimited string of the object's properties", function() {
            const fields = [
                new Field('a', 'a'),
                new Field('b', 'b'),
                new Field('c', 'c')
            ];
            const obj = new OrderedFieldObject(
                fields,
                OrderedFieldObject.Delimeter.pipe
            );
            const str = obj.toDelimitedString();
            assert.equal(str, 'a|b|c');
        });
    });

    describe('#getFieldByName()', function() {
        it('should return the correct fields', function() {
            const fields = [
                new Field('a', 'aaaa'),
                new Field('b', 'bbbb'),
                new Field('c', 'cccc')
            ];
            const obj = new OrderedFieldObject(
                fields,
                OrderedFieldObject.Delimeter.pipe
            );
            assert.equal(obj.getFieldByName('a').value, 'aaaa');
            assert.equal(obj.getFieldByName('b').value, 'bbbb');
            assert.equal(obj.getFieldByName('c').value, 'cccc');
        });
    });
});
