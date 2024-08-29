import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker_threads from 'node:worker_threads';
import { _getCallerDir } from './utils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default async function wormise(params, executedFunction, options) {
    return new Promise((resolve, reject) => {
        const workerScriptPath = join(__dirname, 'thread.js');
        const workerData = {
            cb: `(()=>${executedFunction.toString()})()`,
            params: params,
            callerPath: _getCallerDir() ?? __dirname,
            options,
        };
        const worker = new worker_threads.Worker(workerScriptPath, {
            workerData,
        });
        worker.on('message', workerResult => {
            resolve(workerResult);
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
