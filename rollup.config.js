import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
// import pkg from './package.json'

export default {
  input: 'src/index.ts',
  external: [],
  output: [
    // {
    //   file: pkg.main,
    //   format: 'cjs',
    //   sourcemap: 'inline-source-map',
    //   exports: 'named',
    // },
    // {
    //   file: pkg.module,
    //   format: 'es',
    //   sourcemap: 'inline-source-map',
    //   exports: 'named',
    // },

    // {
    //   dir: 'dist',
    //   format: 'cjs',
    //   sourcemap: 'inline-source-map',
    //   exports: 'named',
    // },
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: 'inline-source-map',
      exports: 'named',
    },
  ],
  plugins: [commonjs(), resolve(), typescript(), babel({ babelHelpers: 'bundled' })],
}
