require('./index.css')
require('./index.less')
require('@babel/polyfill')

class A {
    // a = 1
    start() {
        // console.log('start')
    }
}
const str = new A();
str.start()

"aaaaa".includes('a1')

// eslint-disable-next-line no-undef
let img = new Image();
import logo from '../public/img/back.JPG'
img.src = logo

// eslint-disable-next-line no-undef
document.body.appendChild(img)



// let xhr = new XMLHttpRequest()
// xhr.open("GET", '/api/user', true)

// xhr.onload=()=>{
//     console.log(xhr.response)
// }
// xhr.send()

// let url 
// if(SERVICE_URL){
//     url = 'http://localhost:8080'
// }else{
//     url = 'https://wyshuang.com'
// }
// console.log('--------',url)
// import moment from 'moment'
// const now = moment().endOf('day').fromNow();
// console.log('now',now)
