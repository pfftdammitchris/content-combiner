import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  external: ['src/**/*.test.ts'],
  output: [
    { file: pkg.main, format: 'cjs', sourcemap: 'inline-source-map' },
    { file: pkg.module, format: 'es', sourcemap: 'inline-source-map' },
    { file: pkg.browser, format: 'umd', sourcemap: 'inline-source-map' },
  ],
  plugins: [typescript()],
}
