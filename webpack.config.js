const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// require("@babel/polyfill")

// 优化css
const OptimizeCss = require('optimize-css-assets-webpack-plugin')
// 优化js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    // mode: 'development',
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
    entry: './client-app/index.js',
    output: {
        filename: "bundle.[hash:8].js",
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        port: 3000,
        compress: true,
        progress: true, //启动压缩
        contentBase: path.join(__dirname, 'dist'),
        open: 'Google Chrome',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client-app/index.html',
            filename: "index.html", //默认就可以
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
        new CleanWebpackPlugin(),
        // works productions
        new MiniCssExtractPlugin({
            filename: '[name].[hash:8].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                include: path.resolve(__dirname, 'client-app'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose": true }],
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            },
            {
                test: /\.css$/g,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ],
            },
            {
                test: /\.less$/g,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: true,
                            noIeCompat: true,
                        },
                    },
                ]
            }
        ]
    }
}