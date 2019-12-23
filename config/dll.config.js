const path = require('path')
const webpack = require('webpack')
const { dependencies } = require('../package.json')

const vendors =Object.keys(dependencies).filter(item=>item !== '@babel/runtime')
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