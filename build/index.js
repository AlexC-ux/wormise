var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker_threads from 'node:worker_threads';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default function wormise(params, executedFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const workerScriptPath = join(__dirname, 'thread.js');
            const workerData = {
                cb: `(()=>${executedFunction.toString()})()`,
                params,
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
    });
}
