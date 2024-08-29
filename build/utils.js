import path from 'path';
export function _getCallerDir() {
    const err = new Error();
    const errorRows = err.stack.split('\n');
    const wormiseTrace = errorRows.find(trace => trace.trim().startsWith('at wormise')) ?? '';
    const wormiseTraceIndex = errorRows?.indexOf(wormiseTrace);
    const currentfileTrace = errorRows[wormiseTraceIndex + 1];
    if (!currentfileTrace) {
        return undefined;
    }
    let fileUrl = currentfileTrace?.replace(/.*\((.*)\:.*:.*\)/, '$1').replace('file://', '');
    if (fileUrl.startsWith('/')) {
        fileUrl = fileUrl.replace(/(\/)(.*)/, '$2');
    }
    const filename = path.parse(fileUrl).dir;
    return filename;
}
