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
const run = dataSet => {
    const heap = new FibonacciHeap(
        (a, b) => a.properties[0].value - b.properties[0].value
    );
    dataSet.data.forEach(data => heap.insert(data.getGuid(), data));
    return heap;
};

parentPort.on('message', data => {
    const result = run(data);
    parentPort.postMessage(result);
});

module.exports = run;
