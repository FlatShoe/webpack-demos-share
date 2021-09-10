const {resolve} = require('path')
// 导入 CleanWebpackPlugin
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// 导入 HtmlWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 导入 DefinePlugin
const {DefinePlugin} = require('webpack')
// 导入 CopyWebpackPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundel.js',
    path: resolve(__dirname, 'build')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello webpack',
      // 指定html模版文件的位置
      template: './public/index.html'
    }),
    new DefinePlugin({
      BASE_URL: '"./"'
    }),
    // 配置 CopyWebpackPlugin
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: [
              '**/.DS_Store',
              '**/index.html'
            ]
          }
        }
      ]
    })
  ]
}