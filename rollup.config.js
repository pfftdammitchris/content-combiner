import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  external: ['src/**/*.test.ts'],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: 'inline-source-map',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: 'inline-source-map',
      exports: 'named',
    },
    // {
    //   file: pkg.browser,
    //   format: 'umd',
    //   sourcemap: 'inline-source-map',
    //   name: 'postsAggregator',
    //   globals: {
    //     'lodash.get': 'get',
    //   },
    //   exports: 'default',
    // },
  ],
  plugins: [commonjs(), resolve(), typescript()],
}
