import wormise from '../index.js';
import { it } from 'mocha';
import { expect } from 'chai';

describe('Wormise', () => {
  it('should be a function', () => {
    expect(typeof wormise).to.equal('function');
  });

  it('should return a Promise', () => {
    const promise = wormise(0, async () => Promise.resolve(1));
    expect(promise instanceof Promise).to.be.true;
  });

  it('return correct value synchronously', async () => {
    const calcResult = await wormise(0, (a: number) => {
      return a + 1;
    });
    expect(calcResult).to.equal(1);
  });

  it('return correct value asynchronously', async () => {
    const calcResult = await wormise(0, async (a: number) => {
      return a + 1;
    });
    expect(calcResult).to.equal(1);
  });

  it('return correct value with async function', async () => {
    const calcResult = await wormise(0, async (a: number) => {
      async function getValue() {
        return a + 1;
      }
      return await getValue();
    });
    expect(calcResult).to.equal(1);
  });

  it('return correct value asynchronously with resolve', async () => {
    const calcResult = await wormise(0, async (a: number) => {
      const asyncResult = await new Promise(resolve => {
        resolve(a + 1);
      });
      return await asyncResult;
    });
    expect(calcResult).to.equal(1);
  });

  it('return correct value with imports async', async () => {
    const calcResult = await wormise(0, async (a: number) => {
      const { mockAsyncFn } = await import('./mock-lib.js');
      const asyncResult = await new Promise(async resolve => {
        const b = await mockAsyncFn(a);
        resolve(b + 1);
      });
      return await asyncResult;
    });
    expect(calcResult).to.equal(102);
  });

  it('return correct value with imports async (no fixImports)', async () => {
    const calcResult = await wormise(
      0,
      async (a: number) => {
        //@ts-ignore
        const { mockAsyncFn } = await import('./__tests__/mock-lib.js');
        const asyncResult = await new Promise(async resolve => {
          const b = await mockAsyncFn(a);
          resolve(b + 1);
        });
        return await asyncResult;
      },
      { fixImports: false },
    );
    expect(calcResult).to.equal(102);
  });
});
