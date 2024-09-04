import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';

export default {
    input: ["src/index.ts", "src/thread.ts"],
    external: ["node:worker_threads", "node:path", "node:url", "fs"],
    output: {
        dir: "build",
        format: "es",
        compact: true,
        sourcemap: false,
    },
    plugins: [
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