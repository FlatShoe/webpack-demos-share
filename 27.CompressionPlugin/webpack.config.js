const {resolve} = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new CompressionPlugin({
        // 匹配需要压缩的文件
      test: /\.(css|js)$/
    })
  ]
}