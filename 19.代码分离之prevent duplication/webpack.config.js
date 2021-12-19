const {resolve} = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    // index: {import: './src/index.js', dependOn: 'shared'},
    // main: {import: './src/main.js', dependOn: 'shared'},
    // shared: ['lodash']
    index: './src/index.js',
    main: './src/main.js'
  },
  
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'chunks',
          test: /[\\/]node_modules[\\/]/,
          filename: "[id]_[name]_[hash:8]_vendors.js",
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}