export interface ThreadResultMessageError {
    error: true;
    result: any;
}
export interface ThreadResultMessageSuccess {
    error: false;
    result: any;
}
export type ThreadResultMessage = ThreadResultMessageError | ThreadResultMessageSuccess;
