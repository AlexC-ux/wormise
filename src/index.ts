import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker_threads from 'node:worker_threads';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type CallbackReturnType = Object | void;
type CallbackType<ParamsType, ReturnType> = (params: ParamsType) => ReturnType;

export type WorkerData<ParamsType> = {
  params: ParamsType;
  cb: string;
};

export default async function wormise<ParamsType, ReturnType extends CallbackReturnType>(
  params: ParamsType,
  executedFunction: CallbackType<ParamsType, ReturnType>,
): Promise<ReturnType> {
  return new Promise<ReturnType>((resolve, reject) => {
    const workerScriptPath = join(__dirname, 'thread.js');
    const workerData: WorkerData<ParamsType> = {
      cb: `(()=>${executedFunction.toString()})()`,
      params: params,
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
    worker.on('exit', (code: number, message: string) => {
      const errorObject = {
        message: `Worker stopped with exit code ${code}`,
        code,
      };
      reject(new Error(JSON.stringify(errorObject)));
    });
  });
}
