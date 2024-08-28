# Wormise

[![](https://img.shields.io/npm/v/wormise)![](https://img.shields.io/badge/npm_i_wormise-red)](https://www.npmjs.com/package/wormise) [![](https://img.shields.io/github/stars/AlexC-ux/wormise)](https://github.com/AlexC-ux/wormise)

![](https://img.shields.io/hackage-deps/v/wormise) ![](https://img.shields.io/npm/dm/wormise) 

![wormise](https://github.com/user-attachments/assets/966e0952-6afa-43f8-8329-5c888fe8077d)

## RU

Эта библиотека позволяет **выполнять функцию в новом потоке** и получать доступ к результатам вычислений через `Promise`.

Благодаря `wormise` вы можете получить удобный интерфейс-обертку для работы с вычислениями в новом потоке.

### Описание

`wormise(params, executedFunction): Promise`

`params` - параметры, переданные функции executedFunction.

`executedFunction` - функция, выполняемая в отдельном потоке.

## EN

This library allows you to **execute a function in a new thread** and access the results of the calculation through `Promise`.

With `wormise`, you can get a convenient wrapper interface to work with computations in a new thread.

### Description

`wormise(params, executedFunction): Promise`

`params` - parameters passed to the function executedFunction.

`executedFunction` - function executed in a separate thread.

## Usage example

``` typescript
import wormise from "wormise";

async function getCalculationsResult() {
    try {
        const result = await wormise(0, (params) => {
            // Complicated calculations
            return new Date(params);
        });
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
getCalculationsResult()
```

## Example tsconfig.json

``` json
{
    "compilerOptions": {
        "target": "es2016",
        "module": "NodeNext",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "noImplicitAny": true,
        "skipLibCheck": true,
        "moduleResolution": "NodeNext",
        "outDir": "dist",
    }
}
```
