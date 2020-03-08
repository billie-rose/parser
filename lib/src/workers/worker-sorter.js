const OrderedObject = require('../models/ordered-object');
const { FibonacciHeap } = require('@tyriar/fibonacci-heap');
const { isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}

/**
 * @method
 * @param {Array<OrderedObject} dataSet
 */
function run(data) {
    data.then(parsedObjects => {
        return (
            parsedObjects
                .map(x =>
                    new OrderedObject(x.properties).toDelimetedString(' ')
                )
                //.sort((a, b) => a.properties[0].value - b.properties[0].value)
                .join('\n')
        );
    });
}

parentPort.on('message', data => {
    const result = run(data);
    parentPort.postMessage(result);
});
