# Wormise

[![](https://img.shields.io/npm/v/wormise)![](https://img.shields.io/badge/npm_i_wormise-red)](https://www.npmjs.com/package/wormise) [![](https://img.shields.io/github/stars/AlexC-ux/wormise)](https://github.com/AlexC-ux/wormise)

![](https://img.shields.io/hackage-deps/v/wormise) ![](https://img.shields.io/npm/dm/wormise)

![wormise](https://github.com/user-attachments/assets/966e0952-6afa-43f8-8329-5c888fe8077d)

## RU

Эта библиотека позволяет **выполнять функцию в новом потоке** и получать доступ к результатам вычислений через `Promise`.

Благодаря `wormise` вы можете получить удобный интерфейс-обертку для работы с вычислениями в новом потоке.

### Описание

`wormise(params, executedFunction, ?options): Promise`

`params` - параметры, переданные функции executedFunction.

`executedFunction` - функция, выполняемая в отдельном потоке.

`options` - необязательные настройки.

Указание `options.fixImports = false` позволяет использовать отключить исправление импортов. Пример представлен ниже.

## EN

This library allows you to **execute a function in a new thread** and access the results of the calculation through `Promise`.

With `wormise`, you can get a convenient wrapper interface to work with computations in a new thread.

### Description

`wormise(params, executedFunction, ?options): Promise`

`params` - parameters passed to the function executedFunction.

`executedFunction` - function executed in a separate thread.

`options` - optional settings.

Use `options.fixImports = false` to disable imports rewrite. Example is shown below.

## Usage example

### Without imports

```typescript
import wormise from 'wormise';

async function getCalculationsResult() {
  try {
    const result = await wormise(0, params => {
      // Complicated calculations
      return new Date(params);
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
getCalculationsResult();
```

### With imports

```typescript
import wormise from 'wormise';
import { threadId } from 'worker_threads';
console.log({ threadId });
const data = wormise(undefined, () => {
  (async () => {
    const { threadId } = await import('worker_threads');
    console.log({ threadId });
  })();
});

// Output:
// { threadId: 0 }
// { threadId: 1 }
```

#### Import project lib

```typescript
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
```

#### Import project lib (no fixImports)

```typescript
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
```

## Example tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitAny": true,
    "skipLibCheck": true,
    "moduleResolution": "NodeNext",
    "noEmitHelpers": true,
    "outDir": "dist"
  }
}
```
