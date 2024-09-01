import worker_threads from 'worker_threads';

export interface ThreadResultMessageError {
  error: true;
  result: any;
}

export interface ThreadResultMessageSuccess {
  error: false;
  result: any;
}

export type ThreadResultMessage = ThreadResultMessageError | ThreadResultMessageSuccess;

const workerData = worker_threads.workerData;
let functionText = workerData.cb;
const callback = eval(functionText);
let result: any = undefined;
async function run() {
  try {
    result = await callback(workerData.params);
  } catch (error) {
    const errorMessage: ThreadResultMessageError = {
      error: true,
      result: error,
    };
    worker_threads.parentPort?.postMessage(errorMessage);
  }
  const successMessage: ThreadResultMessageSuccess = {
    error: false,
    result,
  };
  worker_threads.parentPort?.postMessage(successMessage);
}

run();
