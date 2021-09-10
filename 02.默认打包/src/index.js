class Persion {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  sayHi () {
    console.log('hello webpack')
  }
}

const p = new Persion('Flatshoes', 20)
p.sayHi()