var stream,
    { Transform } = require('stream');
const fs = require('fs');
const util = require('util');
const worker_threads = require('worker_threads');

/* function runWorker(path, cb, workerData) {
    const worker = new Worker(path, { workerData });
    worker.on('message', cb.bind(null, null));
    worker.on('error', cb);
    worker.on('exit', exitCode => {
        if (exitCode === 0) {
            return null;
        }
        return cb(new Error(`Worker has stopped with code ${exitCode}`));
    });
    return worker;
} */

// node v0.10+ use native Transform, else polyfill

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

function parse() {
    /*
    A file copy with streams and piping - Author: Naren Arya
*/

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
            console.log(duplicate);
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

        transform = new Upper();
        readable.pipe(transform).pipe(writeable); // Auto pilot ON!
    });
}

parse();

module.exports = parse;
