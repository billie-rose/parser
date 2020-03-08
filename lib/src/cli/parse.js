const fs = require('fs');
const WorkerPool = require('../workers/worker-pool');
const Transformer = require('../models/transformer');
const path = require('path');
const pool = new WorkerPool(path.join(__dirname, '../workers/worker.js'), 1);
const es = require('event-stream');
const parseData = require('../parsingEngine');
const schema = require('../../../schemas/person');
const { Readable } = require('stream');

xform = async chunks => {
    const data = await pool.run(() => chunks);
    return data;
};

function parse() {
    console.time('parse');

    const files = fs.readdirSync(global.globalConfig.inputDir);
    let promises = [];
    for (let i = 0; i < files.length; i++) {
        promises.push(
            new Promise((resolve, reject) => {
                fs.stat(files[i], (err, stats) => {
                    const readable = fs.createReadStream(
                        `${global.globalConfig.inputDir}/${files[i]}`
                    );

                    const chunks = [];
                    readable.on('data', function(chunk) {
                        chunks.push(chunk);
                    });

                    readable.on('end', function() {
                        resolve(
                            Buffer.concat(
                                chunks.map(chunk => Buffer.from(chunk))
                            ).toString('utf8')
                        );
                    });
                });
            })
        );
    }

    Promise.all(promises).then(chunks => {
        xform(chunks.join('\n')).then(parsedObjects => {
            //console.log(parsedObjects);
        });
    });
    console.timeEnd('parse');
}

module.exports = parse;
