var stream,
    { Transform } = require('stream');
const fs = require('fs');
const util = require('util');
const WorkerPool = require('../workers/worker-pool');
const path = require('path');
const pool = new WorkerPool(
    path.join(__dirname, './workers/worker-sorter.js'),
    1
);

function Sorter(options) {
    if (!(this instanceof Sorter)) {
        return new Sorter(options);
    }
    Transform.call(this, options);
}
util.inherits(Sorter, Transform);

Sorter.prototype._transform = async function(chunk, enc, cb) {
    await pool
        .run(() => chunk.toString())
        .then(data => {
            this.push(data);
            cb();
        });
};

/**
 *
 * @param {*} options
 */
function parse(options) {
    console.log(global.globalConfig);
    let files = fs.readdirSync(global.globalConfig.fileDir);
    let destPath = './examples/space_copy.txt';

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

        transform = new Sorter();
        transform.on('error', err => {
            process.stdout.write(err);
        });

        console.time('parse');
        readable
            .pipe(transform)
            .pipe(writeable)
            .on('finish', function() {
                pool.stop();
                console.timeEnd('parse');
            });
    });
}

module.exports = parse;
