type CallbackType<ParamsType, ReturnType> = (params: ParamsType) => ReturnType;
export type WorkerData<ParamsType> = {
    params: ParamsType;
    cb: string;
};
export default function wormise<ParamsType, ReturnType extends Object>(params: ParamsType, executedFunction: CallbackType<ParamsType, ReturnType>): Promise<ReturnType>;
export {};
