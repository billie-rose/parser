const { parentPort, isMainThread, workerData } = require('worker_threads');
const parseData = require('../parsingEngine');
const personSchema = require('../../../schemas/person');

if (isMainThread) {
    throw new Error('This is a worker thread!');
}

(async () => {
    parentPort.on('message', data => {
        const result = parseData(data, ' ', personSchema)
            /* .sort((a, b) => {
                return a.properties[0].value - b.properties[0].value;
            }) */
            .map(x => x.toDelimetedString(' '))
            .join('\n');
        parentPort.postMessage(result);
    });
})();
