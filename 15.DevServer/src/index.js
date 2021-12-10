import './test'
import img from '../assets/images/1.db5e680e.png'
class Persion {
  constructor(name) {
    this.name = name
  }
  sayHi() {
    console.log(`Hello My Name is ${this.name}`)
  }
}
const James = new Persion('James')
James.sayHi()

if (module.hot) {
  module.hot.accept('./test.js', () => {
    console.log('test模块更新了')
  })
}
const image = new Image()
image.src = img
document.body.appendChild(image)
