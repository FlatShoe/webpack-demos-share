module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3.17
      }
    ],
    ['@babel/preset-typescript']
  ]
}