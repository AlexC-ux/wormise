# Wormise

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
