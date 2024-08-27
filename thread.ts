import worker_threads from 'node:worker_threads';
import { WorkerData } from './index';

const workerData: WorkerData<number> = worker_threads.workerData;
console.log({ cb: workerData.cb });
const callback = eval(workerData.cb);
let result = undefined;
try {
  result = callback(workerData.params);
} catch (error) {
  throw error;
}

worker_threads.parentPort?.postMessage(result);
