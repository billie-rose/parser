const fs = require('fs');
const WorkerPool = require('../workers/worker-pool');
const path = require('path');
const pool = new WorkerPool(path.join(__dirname, '../workers/worker.js'), 1);

parseAsync = async chunks => {
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
                        resolve(chunks);
                    });
                });
            })
        );
    }

    Promise.all(promises).then(chunks => {
        const data = chunks.map(chunk => chunk.toString('utf8')).join(' \n');
        parseAsync(data)
            .then(output => {
                console.log(output);
                pool.stop();
            })
            .catch(err => {});
    });
    console.timeEnd('parse');
}

module.exports = parse;
