const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: './client-app/src/index.js',
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
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].[hash:8].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
    module: {
        rules: [
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