var stream,
    { Transform } = require('stream');
const fs = require('fs');
const util = require('util');
const WorkerPool = require('./workers/worker-pool');
const { Worker } = require('worker_threads');
const path = require('path');
const OrderedObject = require('../src/models/ordered-object');
/* const pool = new WorkerPool(path.join(__dirname, './workers/worker.js'), 8); */

function Sorter(options) {
    if (!(this instanceof Sorter)) {
        return new Sorter(options);
    }
    Transform.call(this, options);
}
util.inherits(Sorter, Transform);

Sorter.prototype._transform = async function(chunk, enc, cb) {
    /* await pool
        .run(() => chunk.toString())
        .then(data => {
            this.push(data);
            cb();
        }); */

    for (let i = 0; i < 10; i++) {
        const port = new Worker(require.resolve('./workers/worker.js'), {
            workerData: { data: chunk.toString() }
        });
        port.on('message', result => {
            this.push(result);
        });
    }
};

function parse() {
    let fileName = './examples/space_copy.txt';
    let destPath = './examples/space_copy2.txt';

    const readable = fs.createReadStream(fileName);
    const writeable = fs.createWriteStream(destPath || 'output');

    fs.stat(fileName, (err, stats) => {
        let fileSize = stats.size;
        let counter = 1;
        readable.on('data', chunk => {
            let percentageCopied = ((chunk.length * counter) / fileSize) * 100;
            process.stdout.clearLine(); // clear current text
            process.stdout.cursorTo(0);
            process.stdout.write(`${Math.round(percentageCopied)}%`);
            counter += 1;
        });

        console.time('parse');
        transform = new Sorter();
        readable
            .pipe(transform)
            .pipe(writeable)
            .on('finish', function() {
                // pool.stop();
                console.timeEnd('parse');
            });
    });
}

module.exports = parse;
