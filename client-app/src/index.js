require('./index.css')
require('./index.less')
require("@babel/polyfill");

console.log('11111')
const arr = [1, 2, 3, 4, 5, 7]
console.log('2222', arr.some((item) => item > 8))


class A {
    a = 1
    start() {
        console.log('start')
    }
}
const str = new A();
str.start()
console.log('str.a', str.a)


function* gen() {
    yield 6
}
console.log('generator', gen().next())

console.log('arr.includes(1)',arr.toString().includes('1'))
