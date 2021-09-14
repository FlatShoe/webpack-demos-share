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
        test: /\.m?js$/,
         // 排除 node_modules
        exclude: /node_modules/,
        use: {
          // 使用babel-loader
          loader: 'babel-loader',

          // 根目录下使用了babel.config,所以需要在此使用预设了
          // options: {
          //   // 传入babel预设
          //   // presets: ['@babel/preset-env']
          //   presets: [
          //     [
          //       '@babel/preset-env',
          //       {
          //         // 设置targets
          //         targets: [
          //           "chrome 58",
          //           "ie 11"
          //         ]
          //       }
          //     ]
          //   ]
          // }
        }
      }
    ]
  }
}