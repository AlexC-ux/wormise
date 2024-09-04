import typescript from "@rollup/plugin-typescript";
import multiInput from 'rollup-plugin-multi-input';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
    input: ["src/**/*"],
    output: {
        dir: "./test-build",
        format: "es",
        compact: false,
        sourcemap: true
    },
    plugins: [
        nodeResolve(),
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