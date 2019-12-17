// require('./src/index.js')
import React from 'react'
import {render} from 'react-dom'

console.log(document,'document')
render(<h1>{'123123'}</h1>, document.getElementById('root'))