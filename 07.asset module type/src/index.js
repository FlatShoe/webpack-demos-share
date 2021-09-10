// const img = new Image()

// img.src = require('./images/1.png')
// document.body.appendChild(img)


import './font/font.css'
import './style/index.css'

const createSpan = (className) => {
  const el = document.createElement('p')
  el.classList.add(className)
  el.innerText = 'hello webpack'
  return el
}

document.body.appendChild(createSpan('title1'))
document.body.appendChild(createSpan('title2'))
document.body.appendChild(createSpan('title3'))