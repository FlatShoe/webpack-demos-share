module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // 设置useBuiltIns 为 usage
        // useBuiltIns: 'usage',

        // 设置useBuiltIns 为 entry
        useBuiltIns: 'entry',
        // 设置corejs 版本
        corejs: 3.17
      }
    ]
  ]
}