const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPulgin = require('copy-webpack-plugin') //拷贝资源到dist
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack') //启用多线程打包
require('@babel/polyfill')
const happyThreadPool = HappyPack.ThreadPool({ size: 5 });
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
        filename: 'js/bundle.[hash:8].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        // publicPath:'https://wyshuang.com/'  添加公共路径
    },
    plugins: [
        new HappyPack({
            id: 'js',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    presets: ['@babel/preset-env', ['@babel/preset-react', { 'development': true }]],
                    plugins: [
                        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                        ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                        '@babel/transform-arrow-functions',
                        '@babel/plugin-syntax-dynamic-import',
                        '@babel/plugin-transform-runtime'
                    ]
                }
            }]
        }),
        new HappyPack({
            id: 'css',
            threadPool: happyThreadPool,
            verbose: false,
            loaders: [
                'css-loader',
                'postcss-loader'
            ],
        }),
        new HappyPack({
            id: 'less',
            threadPool: happyThreadPool,
            verbose: false,
            loaders: [
                {
                    loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: '[name]_[local]_[hash:base64:5]',
                        },
                        sourceMap: true
                    }
                },
                'postcss-loader',
                {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true,
                        lessOptions: {
                            strictMath: true,
                        }
                    },
                }
            ]
        }),
        new CleanWebpackPlugin(),
        // works productions
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:8].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
            publicPath: '../'
        }),
        new CopyWebpackPulgin({
            patterns: [
                { from: './client-app/doc', to: './doc' },
            ]
        }),
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
            '@': path.resolve(__dirname, './client-app/src'),
            'components': path.resolve(__dirname, './client-app/src/components'),
            'pages': path.resolve(__dirname, './client-app/src/page'),
            'models': path.resolve(__dirname, './client-app/src/models'),
            'assets': path.resolve(__dirname, './client-app/assets'),
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
                use: 'html-withimg-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                include: path.resolve(__dirname, 'client-app'),
                use: 'happypack/loader?id=js',
            },
            {
                test: /\.css$/g,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'happypack/loader?id=css',
                ]
            },
            {
                test: /\.less$/g,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../'
                        }
                    },
                    'happypack/loader?id=less',
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
                            name: '[hash]-[name].[ext]',
                            // publicPath:'www.wyshuang.com', 为图片单独添加路径前缀
                        }
                    },
                ],
            }
        ]
    }
}