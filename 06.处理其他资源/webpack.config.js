const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            // loader: 'file-loader',
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'img',
              // name: 'img/[name].[hash:8].[ext]'
              limit: 1024
            }
          },
        ],
      }
    ]
  }
}