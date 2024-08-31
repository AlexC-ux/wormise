import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker_threads from 'node:worker_threads';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const wormiseDafaultDirname = (metaUrl) => {
    const __filename = fileURLToPath(metaUrl);
    const __dirname = dirname(__filename);
    return __dirname;
};
let unlinkTimeout;
export default async function wormise(executedFunction, dir, params) {
    return new Promise((resolve, reject) => {
        const origThreadPath = join(__dirname, 'thread.js');
        const newThreadPath = join(dir, 'thread.js');
        const origThreadContent = fs.readFileSync(origThreadPath, 'utf8');
        fs.writeFileSync(newThreadPath, origThreadContent);
        const workerData = {
            cb: `(()=>${executedFunction.toString()})()`,
            params: params,
            rmThreadjsFile: newThreadPath,
        };
        const worker = new worker_threads.Worker(newThreadPath, {
            workerData,
        });
        worker.on('message', workerResult => {
            resolve(workerResult);
            if (unlinkTimeout) {
                clearTimeout(unlinkTimeout);
                unlinkTimeout = setTimeout(() => {
                    fs.unlinkSync(newThreadPath);
                }, 500);
            }
        });
        worker.on('error', workerError => {
            reject(workerError);
        });
        worker.on('exit', (code, message) => {
            const errorObject = {
                message: `Worker stopped with exit code ${code}`,
                code,
            };
            reject(new Error(JSON.stringify(errorObject)));
        });
    });
}
