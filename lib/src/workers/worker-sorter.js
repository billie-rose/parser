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
    data.sort((a, b) => a.properties[0].value - b.properties[0].value);
    return data;
}

parentPort.on('message', data => {
    const result = run(data);
    console.log(result[0].constructor.name);
    parentPort.postMessage(result);
});
