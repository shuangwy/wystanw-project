let {smart}= require('webpack-merge')
let base = require('./webpack.base')

const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports=smart(base,{
    mode:'production',
    optimization: { //生产环境下才会css压缩一行
        minimizer: [
            new OptimizeCss(),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, //方便映射调试
            })
        ],
        // splitChunks: {
        //     cacheGroups: {
        //       styles: {
        //         name: 'styles',
        //         test: /\.css$/,
        //         chunks: 'all',
        //         enforce: true,
        //       },
        //     },
        // }
    },
})