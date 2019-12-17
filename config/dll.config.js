const path = require('path')
const webpack = require('webpack')

const vendors = [
    // "classnames",
    // "cookie-parser",
    // "date-format",
    // "history",
    // "isomorphic-fetch",
    // "js-cookie",
    // "lodash",
    // "normalizr",
    "react",
    "react-dom",
    // "react-redux",
    // "react-router",
    // "react-router-dom",
    // "redux",
    // "redux-thunk",
    // "showdown",
];
module.exports = {
    mode: 'development',
    entry: {
        lib: vendors
    },
    output: {
        filename: '_dll_[name].js',
        path: path.resolve(__dirname, '../lib'),
        library: '_dll_[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            name: '_dll_[name]',
            path: path.resolve(__dirname, '../lib', 'manifest.json'),
            context: __dirname,
        })
    ]
}