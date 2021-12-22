const {resolve} = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  // optimization: {
  //   usedExports: true,
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({
  //       extractComments: false,
  //       parallel: true,
  //       terserOptions: {
  //         compress: {
  //           arguments: false,
  //           dead_code: true
  //         }
  //       }
  //     })
  //   ]
  // },
  plugins: [
    new CleanWebpackPlugin()
  ]
}