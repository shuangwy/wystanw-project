
let url
const env = process.env.NODE_ENV
if (env === 'dev') {
    url = 'http://localhost:8080'
} else {
    url = 'https://wyshuang.com'
}
// console.log('--------',url)
console.log('enve', env)

const proxy = {
    '/api': {
        target: url,
        // changeOrigin: true,
        //pathRewrite: { '/api': '' },//代理转发  服务器已经提供完成
        // secure: true
    }
}

module.exports = proxy;