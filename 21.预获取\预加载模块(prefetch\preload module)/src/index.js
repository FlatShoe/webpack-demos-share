document.body.addEventListener('click', () => {
  import(
    // webpackPrefetch: true
    /* webpackPreload: true */
    './test.js'
  ).then(({default: _default}) => {
    _default()
  })
})