/*
* @Description base
*/
const {join} = require('path')

const resolve = (dir) => {
  return join(__dirname, '..', dir)
}

module.exports = (env) => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: resolve('build')
    }
    // ...
  }
}