import worker_threads from 'worker_threads';
import fs from 'fs';

const workerData = worker_threads.workerData;
let functionText = workerData.cb;
const callback = eval(functionText);
let result = undefined;
async function run() {
  try {
    result = await callback(workerData.params);
  } catch (error) {
    throw error;
  }

  worker_threads.parentPort?.postMessage(result);
}

run();

export const log = console.log;
