const proxy = {
    '/api': {
        target: 'http://localhost:3100',
        pathRewrite: { '/api':''} //代理转发  服务器已经提供完成
    }
}

module.exports = proxy;