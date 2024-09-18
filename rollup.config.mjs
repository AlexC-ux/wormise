import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import { types } from 'util';

export default [
  {
    input: ['src/index.ts', 'src/thread.ts'],
    output: {
      dir: './build/esm',
      format: 'es',
      compact: true,
      sourcemap: false,
      types: './build/types/index.d.ts',
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.esm.json',
      }),
      terser({
        maxWorkers: 4,
      }),
    ],
    treeshake: {
      preset: 'safest',
    },
    logLevel: 'info',
  },
  {
    input: ['src/index.ts'],
    output: {
      file: './build/cjs/index.cjs',
      format: 'cjs',
      compact: true,
      sourcemap: false,
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.cjs.json',
      }),
      terser({
        maxWorkers: 4,
      }),
    ],
    treeshake: {
      preset: 'safest',
    },
    logLevel: 'info',
  },
  {
    input: ['src/thread.ts'],
    output: {
      dir: './build/cjs',
      format: 'cjs',
      compact: true,
      sourcemap: false,
    },
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: './tsconfig.cjs.json',
      }),
      terser({
        maxWorkers: 4,
      }),
    ],
    treeshake: {
      preset: 'safest',
    },
    logLevel: 'info',
  },
];
