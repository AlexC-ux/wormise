import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker_threads from 'node:worker_threads';
import fs from 'fs';
import { ThreadResultMessage } from './thread.js';
const _dirname = typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));

export const wormiseDafaultDirname = (metaUrl: string) => {
  const filename = fileURLToPath(metaUrl);
  const dir = dirname(filename);
  return dir;
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
    const origThreadPath = join(_dirname, 'thread.js');
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
    worker.on('message', (workerResult: ThreadResultMessage) => {
      if (workerResult.error) {
        reject(workerResult.result);
      } else {
        resolve(workerResult.result);
      }
      try {
        if (unlinkTimeout) {
          clearTimeout(unlinkTimeout);
          unlinkTimeout = setTimeout(() => {
            fs.unlinkSync(newThreadPath);
          }, 500);
        }
      } catch (error) {
        console.error(error);
      }
    });
    worker.on('error', workerError => {
      reject(workerError);
    });
  });
}
