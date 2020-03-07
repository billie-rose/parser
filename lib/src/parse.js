var stream,
    { Transform } = require('stream');
const fs = require('fs');
const util = require('util');
const parseData = require('./parsingEngine');
const personSchema = require('../../schemas/person');
const WorkerPool = require('./workers/worker-pool');
const path = require('path');

const pool = new WorkerPool(
    path.join(__dirname, './workers/worker-sorter.js'),
    3
);

function Upper(options) {
    // allow use without new
    if (!(this instanceof Upper)) {
        return new Upper(options);
    }

    // init Transform
    Transform.call(this, options);
}
util.inherits(Upper, Transform);

Upper.prototype._transform = function(chunk, enc, cb) {
    const upperChunk = chunk.toString().toUpperCase();
    this.push(upperChunk);
    cb();
};

function Sorter(options) {
    if (!(this instanceof Sorter)) {
        return new Sorter(options);
    }
    Transform.call(this, options);
}
util.inherits(Sorter, Transform);

Sorter.prototype._transform = function(chunk, enc, cb) {
    let data = parseData(chunk.toString(), ' ', personSchema);
    data = pool
        .run(() => data)
        .then(result => result.map(obj => obj.toString().join('\n')));
    cb();
};

function parse() {
    let fileName = './examples/space.txt';
    let destPath = './examples/space_copy.txt';

    const readable = fs.createReadStream(fileName);
    const writeable = fs.createWriteStream(destPath || 'output');

    fs.stat(fileName, (err, stats) => {
        let fileSize = stats.size;
        let counter = 1;
        let fileArray = fileName.split('.');
        let duplicate;
        try {
            duplicate = destPath + '/' + fileArray[0] + '_Copy.' + fileArray[1];
        } catch (e) {
            console.exception(
                'File name is invalid! please pass the proper one'
            );
        }

        process.stdout.write(`File: ${duplicate} is being created:`);

        readable.on('data', chunk => {
            let percentageCopied = ((chunk.length * counter) / fileSize) * 100;
            process.stdout.clearLine(); // clear current text
            process.stdout.cursorTo(0);
            process.stdout.write(`${Math.round(percentageCopied)}%`);
            counter += 1;
        });
        // In case if we have an interruption while copying
        writeable.on('unpipe', e => {
            process.stdout.write(15);
        });

        transform = new Sorter();
        readable
            .pipe(transform)
            .pipe(writeable)
            .on('finish', function() {
                pool.stop();
            });
    });
}

module.exports = parse;
