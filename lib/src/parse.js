module.exports = parse;
module.exports = logProperty;

function parse() {
    console.log('parsing....');
}

function logProperty(target, key) {
    let value;

    const getter = function() {
        console.log(`Get => ${key}`);
        return value;
    };

    const setter = function(newVal) {
        console.log(`Set: ${key} => ${newVal}`);
        value = newVal;
    };

    Reflect.deleteProperty[key];
    Reflect.defineProperty(target, key, {
        get: getter,
        set: setter
    });
}
