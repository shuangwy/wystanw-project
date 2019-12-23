const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPulgin = require('copy-webpack-plugin') //拷贝资源到dist
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Happypack = require('happypack') //启用多线程打包
// require("@babel/polyfill")

module.exports = {
    mode: 'development',
    // noParse://, 不去解析依赖
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            // minRemainingSize: 0,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 6,
            maxInitialRequests: 4,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    entry: './client-app/index.js',
    output: {
        filename: "js/bundle.[hash:8].js",
        path: path.resolve(__dirname, 'dist'),
        // publicPath:'https://wyshuang.com/'  添加公共路径
    },
    plugins: [
        new Happypack({
            id: 'js',
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', ["@babel/preset-react", { "development": true }]],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { "legacy": true }],
                        ["@babel/plugin-proposal-class-properties", { "loose": true }],
                        '@babel/plugin-transform-runtime'
                    ]
                }
            }]
        }),
        new Happypack({
            id: 'css',
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader'
            ],
        }),
        new Happypack({
            id: "less",
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
        }),
        new CleanWebpackPlugin(),
        // works productions
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new CopyWebpackPulgin([
            { from: "./client-app/doc", to: "./doc" },
        ]),
        new Webpack.BannerPlugin({ banner: 'make 2020 by wystan' }), //添加版权信息
        new Webpack.DefinePlugin({
            SERVICE_URL: JSON.stringify('https://wyshuang.com')
        }),
        new Webpack.IgnorePlugin(/\.\/locale/, /moment/),
       

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
                use: 'Happypack/loader?id=js',
            },
            {
                test: /\.css$/g,
                use: 'Happypack/loader?id=css'
            },
            {
                test: /\.less$/g,
                use: 'Happypack/loader?id=less'
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