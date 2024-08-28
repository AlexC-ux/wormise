import worker_threads from 'worker_threads';
import { WorkerData } from 'wormise/src';

const workerData: WorkerData<number> = worker_threads.workerData;
const callback = eval(workerData.cb);
let result = undefined;
try {
  result = callback(workerData.params);
} catch (error) {
  throw error;
}

worker_threads.parentPort?.postMessage(result);
