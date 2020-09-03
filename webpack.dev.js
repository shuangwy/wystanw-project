const {
    merge
} = require('webpack-merge')
const base = require('./webpack.base')
const proxy = require('./api')
const path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

module.exports = merge(base, {
    mode: 'development',
    devServer: {
        port: 3000,
        compress: true,
        progress: true, //启动压缩
        contentBase: path.join(__dirname, 'dist'),
        open: 'Google Chrome',
        proxy: proxy,
        hot: true,
    },
    devtool: 'eval-cheap-module-source-map',
    watch: true, //事实打包
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: /node_modules/,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client-app/index.html',
            filename: 'index.html', //默认就可以
            meta: {
                viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
            },
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
        new Webpack.DllReferencePlugin({
            manifest: require(path.resolve(__dirname, './lib', 'manifest.json')),
            context: __dirname,
        }),
        new Webpack.NamedChunksPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, './lib/*.js')
        })

    ]
})