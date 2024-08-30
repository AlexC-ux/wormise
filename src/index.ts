import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker_threads from 'node:worker_threads';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const wormiseDafaultDirname = (metaUrl: string) => {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = dirname(__filename);
  return __dirname;
};

type CallbackReturnType = Object | void;
type CallbackType<ParamsType, ReturnType> = (params: ParamsType) => ReturnType;

/**
 * Wormise options
 * @default { fixImports: true }
 */
export interface WormiseOptions {
  fixImports?: boolean;
}

export type WorkerData<ParamsType> = {
  params: ParamsType;
  cb: string;
  rmThreadjsFile: string;
};

let unlinkTimeout: NodeJS.Timeout | undefined;

export default async function wormise<ParamsType, ReturnType extends CallbackReturnType>(
  executedFunction: CallbackType<ParamsType, ReturnType>,
  dir: string,
  params: ParamsType,
): Promise<ReturnType> {
  return new Promise<ReturnType>((resolve, reject) => {
    const origThreadPath = join(__dirname, 'thread.js');
    const newThreadPath = join(dir, 'thread.js');

    const origThreadContent = fs.readFileSync(origThreadPath, 'utf8');
    fs.writeFileSync(newThreadPath, origThreadContent);
    const workerData: WorkerData<ParamsType> = {
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
        }, 100);
      }
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
