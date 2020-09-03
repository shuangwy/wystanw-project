let { merge } = require('webpack-merge')
let base = require('./webpack.base')
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(base, {
    mode: 'production',
    optimization: { //生产环境下才会css压缩一行
        minimizer: [
            new OptimizeCss(),
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, //方便映射调试
            })
        ],
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                },
            },
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client-app/index.html',
            filename: 'index.html', //默认就可以
            meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
            title: '天卫二十二',
            minify: {
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            hash: true,
        }),
    ]
})