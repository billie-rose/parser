const fs = require('fs');
const WorkerPool = require('../workers/worker-pool');
const path = require('path');
const pool = new WorkerPool(path.join(__dirname, '../workers/worker.js'), 1);

parseAsync = async chunks => {
    return await pool.run(() => chunks);
};

async function parse() {
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
                        resolve(Buffer.concat(chunks).toString('utf8'));
                    });

                    readable.on('error', () => reject(err));
                });
            })
        );
    }

    const chunks = await Promise.all(promises);
    const data = chunks.map(chunk => chunk.split('\n')).flat();
    const output = await parseAsync(data);

    fs.writeFile(global.globalConfig.exportPath, output, err => {
        if (err) {
            throw err;
        }
        pool.stop();
    });
}

module.exports = parse;
