const { Worker } = require('worker_threads');

/**
 * @class WorkerPool
 * @classdesc Thread manager who will spawn and process work on threads as needed
 * @property {string} this.name
 * @property {string} this.value
 */
class WorkerPool {
    _queue = [];
    _workersById = {};
    _activeWorkersById = {};
    _workers = [];
    numberOfThreads = 0;
    workerPath;

    __init = () => {
        for (let i = 0; i < this.numberOfThreads; i++) {
            const worker = new Worker(this.workerPath);
            this._workers.push(worker);
            this._workersById[i] = worker;
            this._activeWorkersById[i] = false;
        }
    };

    /**
     * @param {string} workerPath
     * @param {number} numberOfThreads
     */
    constructor(workerPath, numberOfThreads) {
        this.workerPath = workerPath;
        this.numberOfThreads = numberOfThreads;
        this.__init();
    }

    __getInactiveWorkerId = () => {
        for (let i = 0; i < this.numberOfThreads; i++) {
            if (!this._activeWorkersById[i]) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Runs work (getData) on a thread if one is available, otherwise adds it to a queue
     * @param {function} getData work to be done
     * @returns {Promise} a promise
     */
    run = getData => {
        return new Promise((resolve, reject) => {
            const availableWorkerId = this.__getInactiveWorkerId();
            const queueItem = {
                getData,
                callback: (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                }
            };
            if (availableWorkerId === -1) {
                this._queue.push(queueItem);
                return null;
            }
            this.runWorker(availableWorkerId, queueItem);
        });
    };

    /**
     * Kill all worker threads
     * @returns {Promise<Any>}
     */
    stop = () => {
        return Promise.all(this._workers.map(worker => worker.terminate()));
    };

    /**
     * Posts a message to an active thread by id telling that thread to begin
     * processing. Once done, remove the thread from the active pool.
     * @param {*} workerId
     * @param {*} queueItem
     */
    runWorker(workerId, queueItem) {
        const worker = this._workersById[workerId];
        this._activeWorkersById[workerId] = true;
        const messageCallback = result => {
            queueItem.callback(null, result);
            cleanUp();
        };
        const errorCallback = error => {
            queueItem.callback(error);
            cleanUp();
        };
        const cleanUp = () => {
            worker.removeAllListeners('message');
            worker.removeAllListeners('error');
            this._activeWorkersById[workerId] = false;
            if (!this._queue.length) {
                return null;
            }
            this.runWorker(workerId, this._queue.shift());
        };
        worker.once('message', messageCallback);
        worker.once('error', errorCallback);
        worker.postMessage(queueItem.getData());
    }
}

module.exports = WorkerPool;
