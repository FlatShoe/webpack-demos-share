const {resolve, join} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  // 配置devServer
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
    publicPath: '/'
  },
  devServer: {
    // 开启热更新
    hot: true,
    host: '0.0.0.0',
    compress: true
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:8].[ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10000
          }
        }
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CleanWebpackPlugin()
  ]
}