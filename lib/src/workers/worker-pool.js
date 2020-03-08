const { Worker } = require('worker_threads');

class WorkerPool {
    _queue = []; //: QueueItem<T, N>[] = [];
    _workersById = {}; //: { [key: number]: Worker }
    _activeWorkersById = {}; //{ [key: number]: boolean } =
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

    stop = () => {
        return Promise.all(this._workers.map(worker => worker.terminate()));
    };

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
