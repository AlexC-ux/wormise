import typescript from "@rollup/plugin-typescript";
import multiInput from 'rollup-plugin-multi-input';

export default {
    input: ["src/**/*"],
    external: ["node:worker_threads", "node:path", "node:url", "fs"],
    output: {
        dir: "./test-build",
        format: "es",
        compact: false,
        sourcemap: true
    },
    plugins: [
        typescript({
            tsconfig: "./tsconfig.test.json"
        }),
        multiInput(),
    ],
    treeshake: {
        preset: "safest"
    },
    logLevel: "info"
};