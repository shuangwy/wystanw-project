const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPulgin = require('copy-webpack-plugin') //拷贝资源到dist
const Webpack = require('webpack')
// require("@babel/polyfill")

module.exports = {
    mode: 'development',
    // noParse://, 不去解析依赖    
    entry: './client-app/index.js',
    output: {
        filename: "js/bundle.[hash:8].js",
        path: path.resolve(__dirname, 'dist'),
        // publicPath:'https://wyshuang.com/'  添加公共路径
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
            filename: 'css/[name].[hash:8].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CopyWebpackPulgin([
            { from: "./client-app/doc", to: "./doc" }
        ]),
        new Webpack.BannerPlugin({ banner: 'make 2020 by wystan' }), //添加版权信息
        new Webpack.DefinePlugin({
            SERVICE_URL: JSON.stringify('https://wyshuang.com')
        }),
        new Webpack.IgnorePlugin(/\.\/locale/, /moment/),
        new Webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'lib', 'manifest.json'),
            context: __dirname,
        })
    ],
    externals: { //不打包
    },
    resolve: {
        modules: [path.resolve('node_modules')],
        alias: {
            "@": path.resolve(__dirname, './client-app/src')
        },
        extensions: ['.js', '.css', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'client-app'),
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader',
                },
                enforce: 'pre',
            },
            {
                test: /\.html$/,
                use: "html-withimg-loader"
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                include: path.resolve(__dirname, 'client-app'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', ["@babel/preset-react", { "development": true }]],
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
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 200 * 1024,
                            outputPath: 'images',
                            // publicPath:'www.wyshuang.com', 为图片单独添加路径前缀
                        }
                    },
                ],
            }
        ]
    }
}