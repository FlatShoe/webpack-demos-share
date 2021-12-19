const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  }
}