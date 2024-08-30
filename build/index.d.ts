export declare const wormiseDafaultDirname: (metaUrl: string) => string;
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
    rmThreadjsFile: string;
};
export default function wormise<ParamsType, ReturnType extends CallbackReturnType>(executedFunction: CallbackType<ParamsType, ReturnType>, dir: string, params: ParamsType): Promise<ReturnType>;
export {};
