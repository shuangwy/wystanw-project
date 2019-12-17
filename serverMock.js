let express = require('express')
let app = express()
let webpack = require('webpack')


// 启动server时，把webpack也启动 使用中间件 同一个端口，即不存在跨域
let middle = require('webpack-dev-middleware')
let config = require('./webpack.config')
let compiler = webpack(config)
app.use(middle(compiler))



app.get('/user', (req, res) => {
    res.json({ name: "我是你爽哥哥yayay" })
})
app.listen(3100)