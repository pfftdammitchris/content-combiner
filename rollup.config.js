import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.ts',
  external: [],
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: 'inline-source-map',
      exports: 'named',
    },
  ],
  plugins: [commonjs(), resolve(), typescript(), babel({ babelHelpers: 'bundled' })],
}
