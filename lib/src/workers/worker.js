const { parentPort, isMainThread, workerData } = require('worker_threads');
const parseData = require('../parsingEngine');
const personSchema = require('../../../schemas/person');

if (isMainThread) {
    throw new Error('This is a worker thread!');
}

(async () => {
    parentPort.on('message', data => {
        let result = parseData(
            data.toString(),
            personSchema
        ).getSerializedSortedData(result);
        parentPort.postMessage(result);
    });
})();
