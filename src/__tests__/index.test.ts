import wormise, { wormiseDafaultDirname } from '../index.js';
import { expect } from 'chai';
import { threadId } from 'worker_threads';
const currentDir = wormiseDafaultDirname(import.meta.url);
describe('Wormise', () => {
  it('should be a function', () => {
    expect(typeof wormise).to.equal('function');
  });

  it('should return a Promise', () => {
    const promise = wormise(async () => Promise.resolve(1), currentDir, 0);
    expect(promise instanceof Promise).to.be.true;
  });

  it('return correct value synchronously', async () => {
    const calcResult = await wormise(
      (a: number) => {
        return a + 1;
      },
      currentDir,
      2,
    );
    expect(calcResult).to.equal(3);
  });

  it('return correct value asynchronously', async () => {
    const calcResult = await wormise(
      async (a: number) => {
        return a + 1;
      },
      currentDir,
      0,
    );
    expect(calcResult).to.equal(1);
  });

  it('return correct value with async function', async () => {
    const calcResult = await wormise(
      async (a: number) => {
        async function getValue() {
          return a + 1;
        }
        return await getValue();
      },
      currentDir,
      0,
    );
    expect(calcResult).to.equal(1);
  });

  it('return correct value asynchronously with resolve', async () => {
    const calcResult = await wormise(
      async (a: number) => {
        const asyncResult = await new Promise(resolve => {
          resolve(a + 1);
        });
        return await asyncResult;
      },
      currentDir,
      0,
    );
    expect(calcResult).to.equal(1);
  });

  it('return correct value with imports async', async () => {
    const calcResult = await wormise(
      async (a: number) => {
        const { mockAsyncFn } = await import('./mocks/index.js');
        const asyncResult = await new Promise(async resolve => {
          const b = await mockAsyncFn(a);
          resolve(b + 1);
        });
        return await asyncResult;
      },
      currentDir,
      0,
    );
    expect(calcResult).to.equal(102);
  });

  it('This thread not equal wormise thread', async () => {
    const thisThreadId = threadId;
    const wormiseThreadId = await wormise(
      async () => {
        const logWormiseThreadId = async () => {
          const { threadId } = await import('worker_threads');
          return threadId;
        };
        return await logWormiseThreadId();
      },
      currentDir,
      undefined,
    );
    expect(wormiseThreadId).to.be.greaterThan(0);
    expect(thisThreadId).to.be.equal(0);
    expect(thisThreadId).to.not.equal(wormiseThreadId);
  });

  it('return correct value if durable operation', async () => {
    const calcResult = await wormise(
      async (a: number) => {
        await new Promise<undefined>(res => {
          setTimeout(() => {
            res(undefined);
          }, 1500);
        });
        const asyncResult = await new Promise(resolve => {
          resolve(a + 1);
        });
        return await asyncResult;
      },
      currentDir,
      0,
    );
    expect(calcResult).to.equal(1);
  });

  it('return correct value if thrown error', async () => {
    let hasError = false;
    let errorMessage = '';
    try {
      await wormise(
        async (a: number) => {
          throw 'expected error message';
        },
        currentDir,
        0,
      );
    } catch (err) {
      errorMessage = `${err}`;
      hasError = true;
    }
    expect(hasError).to.be.true;
    expect(errorMessage).to.equal('expected error message');
  });

  it('Works with many threads', async () => {
    const threasCount = 15;

    const mockFn = async () => {
      const treads = await import('worker_threads');
      await new Promise<undefined>(res => {
        setTimeout(() => {
          res(undefined);
        }, 200);
      });
      const asyncResult = await new Promise<number>(resolve => {
        resolve(treads.threadId);
      });
      return await asyncResult;
    };
    const promises = [];

    for (let i = 0; i < threasCount; i++) {
      const calcResult = wormise<any, Promise<number>>(mockFn, currentDir, undefined);
      promises.push(calcResult);
    }
    const awaitedPromises = await Promise.all(promises);
    expect(promises).to.have.length(threasCount);
    expect(awaitedPromises).to.have.length(promises.length);
    for (const threadId of awaitedPromises) {
      const threadIds = awaitedPromises.filter(promiseThreadId => promiseThreadId === threadId);
      expect(threadIds).to.have.length(1);
    }
  }).timeout(1000);
});
