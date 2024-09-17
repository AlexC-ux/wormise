import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';

export default {
    input: ["src/index.ts", "src/thread.ts"],
    output: {
        dir: "build",
        format: "cjs",
        compact: true,
        sourcemap: false,
    },
    plugins: [
        nodeResolve(),
        typescript({
            tsconfig: "./tsconfig.json"
        }),
        terser({
            maxWorkers: 4
        })
    ],
    treeshake: {
        preset: "safest"
    },
    logLevel: "info"
};