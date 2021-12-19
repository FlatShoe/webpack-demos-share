// 通过`import()`进行导入
import(/* webpackChunkName: 'test' */ './util').then(res => {
  console.log(res)
})