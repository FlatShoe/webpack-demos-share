const {resolve} = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: {import: './src/index.js', dependOn: 'shared'},
    main: {import: './src/main.js', dependOn: 'shared'},
    shared: ['lodash']
  },
  output: {
    filename: '[name].bundle.js',
    path: resolve(__dirname, 'build')
  }
}