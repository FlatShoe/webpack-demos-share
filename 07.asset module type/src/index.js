// const img = new Image()

// img.src = require('./images/1.png')
// document.body.appendChild(img)


import './font/font.css'
import './style/index.css'

const createSpan = (className) => {
  const el = document.createElement('span')
  el.classList.add(className)
  return el
}

document.body.appendChild(createSpan('title1'))
document.body.appendChild(createSpan('title2'))
document.body.appendChild(createSpan('title3'))