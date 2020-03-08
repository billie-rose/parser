var stream,
    { Transform } = require('stream');
const fs = require('fs');
const util = require('util');
const WorkerPool = require('../workers/worker-pool');
const path = require('path');
const pool = new WorkerPool(
    path.join(__dirname, '../workers/worker-sorter.js'),
    1
);

function Parser(options) {
    Transform.call(this, options);
}
util.inherits(Parser, Transform);

Parser.prototype._transform = async function(chunk, enc, cb) {
    console.log(chunk.toString());
    await pool
        .run(() => chunk.toString())
        .then(data => {
            console.log(data);
            this.push(data);
            cb();
        });
};

function parse() {
    const files = fs.readdirSync(global.globalConfig.inputDir);
    const writeable = fs.createWriteStream(global.globalConfig.exportPath);
    writeable.on('close', () => pool.stop());

    console.time('parse');
    for (let i = 0; i < files.length; i++) {
        fs.stat(files[i], (err, stats) => {
            const readable = fs.createReadStream(
                `${global.globalConfig.inputDir}/${files[i]}`
            );

            transform = new Parser();
            readable.pipe(transform).pipe(writeable);
        });
    }
    console.timeEnd('parse');
}

module.exports = parse;
