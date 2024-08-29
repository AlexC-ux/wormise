import worker_threads from 'worker_threads';
import { WorkerData } from './index.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const workerData: WorkerData<number> = worker_threads.workerData;
let functionText = workerData.cb;

const replaceImports = () => {
  const callerPath = path.parse(`${workerData.callerPath!.replace(/\//g, '\\')}/index.js`).dir.replace(/\//g, '\\');
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.parse(`${dirname(__filename).replace(/\//g, '\\')}/index.js`).dir.replace(/\//g, '\\');
  console.log({ __dirname, callerPath });
  const imports = functionText.match(/import\(.\.\/(.*).\)/gm);
  const importsReplced: string[] = [];
  if (!!imports && callerPath) {
    for (const importName of imports) {
      const importFilePath = importName.replace(/import\(.(.*).\)/, '$1');

      const newImportPath =
        './' + path.join('.', callerPath.replace(__dirname, ''), importFilePath).replace(/\\/g, '/');
      importsReplced.push(newImportPath);
    }
  }

  for (let index = 0; index < (imports?.length ?? 0); index++) {
    const originalImport = imports?.[index];
    const newImport = importsReplced?.[index];

    if (originalImport && newImport) {
      functionText = functionText.replaceAll(
        originalImport,
        originalImport.replace(/(import\(.)(.*)(.\))/, '$1' + newImport + '$3'),
      );
    }
  }
};

if (workerData.options?.fixImports !== false) {
  replaceImports();
}

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
