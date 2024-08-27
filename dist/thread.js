var _a;
import worker_threads from 'node:worker_threads';
console.log('Worker thread started');
const workerData = worker_threads.workerData;
const callback = eval(workerData.cb);
let result = undefined;
try {
    result = callback(workerData.params);
}
catch (error) {
    throw error;
}
(_a = worker_threads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage(result);
console.log('Worker thread stopped');
