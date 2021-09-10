class Animal {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  run () {
    console.log('run')
  }
}

const dog = new Animal('wangwang', 1)
dog.run()