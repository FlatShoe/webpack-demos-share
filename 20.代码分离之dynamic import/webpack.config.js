const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    chunkFilename: 'chunk_[name].js',
    path: resolve(__dirname, 'build')
  },
  optimization: {
    chunkIds: 'natural',
  }
}