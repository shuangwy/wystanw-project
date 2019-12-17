const {smart}= require('webpack-merge')
const base = require('./webpack.base')
const proxy = require('./api')
const path = require('path')


module.exports=smart(base,{
    mode:'development',
    devServer: {
        port: 3000,
        compress: true,
        progress: true, //启动压缩
        contentBase: path.join(__dirname, 'dist'),
        open: 'Google Chrome',
        proxy: proxy
    },
     devtool: "eval-source-map",
    // watch: true, //事实打包
    // watchOptions: {
    //     aggregateTimeout: 300,
    //     poll: 1000,
    //     ignored: /node_modules/,
    // },
})