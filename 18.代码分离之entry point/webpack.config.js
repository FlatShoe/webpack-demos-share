const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
    main: './src/main.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  }
}