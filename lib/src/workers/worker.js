const { parentPort, isMainThread, workerData } = require('worker_threads');
const ParsingEngine = require('../models/parsing-engine');
const personSchema = require('../../../schemas/person');

// This should only ever be a child spawned from a WorkerPool
if (isMainThread) {
    throw new Error('This is a worker thread!');
}

/**
 * Runs work (in this instance parsing data) when spawned and passes the result back to the pool.
 * @returns {Promise<any>}
 */
(async () => {
    parentPort.on('message', data => {
        // Passing in a specific schema obviously not ideal. The end game was to allow users to define any number of json files
        // and then pass its name to the program along with some args (where to export, which delims to use,
        // etc), but I ran out of time.
        parser = new ParsingEngine(data, personSchema);
        const headerTemplate = 'Output ${rowNumber}:';
        parentPort.postMessage(parser.parseToOutput(headerTemplate));
    });
})();
