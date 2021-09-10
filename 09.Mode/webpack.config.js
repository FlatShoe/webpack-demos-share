const {resolve} = require('path')

module.exports = {
    // 配置模式
  mode: 'development', // 开发模式
  // mode: 'production', // 默认打包模式为生产模式
  // mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  }
}