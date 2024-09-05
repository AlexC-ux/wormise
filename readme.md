
# Wormise

![](https://img.shields.io/bundlephobia/minzip/wormise) ![](https://img.shields.io/bundlephobia/min/wormise)

[![](https://img.shields.io/npm/v/wormise)![](https://img.shields.io/badge/npm_i_wormise-red)](https://www.npmjs.com/package/wormise) [![](https://img.shields.io/github/stars/AlexC-ux/wormise)](https://github.com/AlexC-ux/wormise)

![](https://img.shields.io/hackage-deps/v/wormise) ![](https://img.shields.io/npm/dm/wormise)

![](https://github.com/AlexC-ux/wormise/actions/workflows/wf-testing.yml/badge.svg?branch=main)

![wormise](https://github.com/user-attachments/assets/966e0952-6afa-43f8-8329-5c888fe8077d)

## RU

Эта Node.js библиотека позволяет **выполнять функцию в новом потоке** и получать доступ к результатам вычислений через `Promise`.

Благодаря `wormise` вы можете получить удобный интерфейс-обертку для работы с вычислениями в новом потоке.

### Описание

`wormise(executedFunction, dir, params): Promise`

`dir` - папка в которой выполняется вызов wormise

`executedFunction` - функция, выполняемая в отдельном потоке.

`params` - параметры для _executedFunction_

## EN

This Node.js library allows you to **execute a function in a new thread** and access the results of the calculation through `Promise`.

With `wormise`, you can get a convenient wrapper interface to work with computations in a new thread.

### Description

`wormise(executedFunction, dir, params): Promise`

`dir` - the folder where the wormise call is made.

`executedFunction` - function executed in a separate thread.

`params` - arguments for _executedFunction_

## Usage example

[Codesandbox example link](https://codesandbox.io/p/devbox/wormise-example-k3z3dk?file=%2Findex.js)

### Without imports

```typescript
import wormise, { wormiseDafaultDirname } from 'wormise';
const dir = wormiseDafaultDirname(import.meta.url);
async function getCalculationsResult() {
  try {
    const result = await wormise(
      params => {
        // Complicated calculations
        return new Date(params);
      },
      dir,
      Date.now(),
    );
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
getCalculationsResult();
```

### With imports

```typescript
import wormise, { wormiseDafaultDirname } from 'wormise';
const dir = wormiseDafaultDirname(import.meta.url);
import { threadId } from 'worker_threads';
console.log({ threadId });
const data = wormise(
  async () => {
    const logWormiseThreadId = async () => {
      const { threadId } = await import('worker_threads');
      console.log({ threadId });
    };
    await logWormiseThreadId();
  },
  dir,
  undefined,
);

// Output:
// { threadId: 0 }
// { threadId: 1 }
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
