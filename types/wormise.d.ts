declare module wormise {
  export default function wormise<ParamsType, ReturnType extends Object>(
    params: ParamsType,
    executedFunction: CallbackType<ParamsType, ReturnType>,
  ): Promise<ReturnType>;
}
