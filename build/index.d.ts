type CallbackReturnType = Object | void;
type CallbackType<ParamsType, ReturnType> = (params: ParamsType) => ReturnType;
/**
 * Wormise options
 * @default { fixImports: true }
 */
export interface WormiseOptions {
    fixImports?: boolean;
}
export type WorkerData<ParamsType> = {
    params: ParamsType;
    cb: string;
    callerPath: string;
    options?: WormiseOptions;
};
export default function wormise<ParamsType, ReturnType extends CallbackReturnType>(params: ParamsType, executedFunction: CallbackType<ParamsType, ReturnType>, options?: WormiseOptions): Promise<ReturnType>;
export {};
