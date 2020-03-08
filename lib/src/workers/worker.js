const { parentPort, isMainThread, workerData } = require('worker_threads');
const ParsingEngine = require('../models/parsing-engine');
const personSchema = require('../../../schemas/person');

if (isMainThread) {
    throw new Error('This is a worker thread!');
}

(async () => {
    parentPort.on('message', data => {
        parser = new ParsingEngine(data, personSchema);
        const headerTemplate = 'Output ${rowNumber}:';
        parentPort.postMessage(parser.parseToOutput(headerTemplate));
    });
})();
