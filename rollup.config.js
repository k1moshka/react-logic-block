import babel from '@rollup/plugin-babel'
import flowEntry from 'rollup-plugin-flow-entry'
import copy from 'rollup-plugin-copy'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins: [
    copy({
      targets: [{ src: 'src/types', dest: 'lib' }]
    }),
    flowEntry({
      types: 'lib/types/index.js'
    }),
    babel()
  ]
}
