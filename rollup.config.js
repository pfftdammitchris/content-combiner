import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  external: ['src/**/*.test.ts'],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: 'inline-source-map',
      exports: 'default',
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: 'inline-source-map',
      exports: 'default',
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
  plugins: [typescript()],
}
