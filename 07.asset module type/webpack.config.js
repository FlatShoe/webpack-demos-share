const {resolve} = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        // type: 'asset/resource',
        type: 'asset',
        generator: {
          filename: 'img/[name].[hash:8].[ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100000
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'font/[name].[hash:8].[ext]'
        }
      }
    ]
  }
}