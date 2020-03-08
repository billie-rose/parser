const { parentPort, isMainThread, workerData } = require('worker_threads');
const parseData = require('../parsingEngine');
const personSchema = require('../../../schemas/person');

if (isMainThread) {
    throw new Error('Its not a worker');
}

const { data } = workerData;
(async () => {
    const result = parseData(data, ' ', personSchema)
        /* .sort((a, b) => {
                return a.properties[0].value - b.properties[0].value;
            }) */
        .map(x => x.toDelimetedString(' '))
        .join('\n');
    parentPort.postMessage(result);
})();

/* (async () => {
    parentPort.on('message', data => {
        const result = parseData(data, ' ', personSchema)
            /* .sort((a, b) => {
                return a.properties[0].value - b.properties[0].value;
            })
            .map(x => x.toDelimetedString(' '))
            .join('\n');
        parentPort.postMessage(result);
    });
})(); */
