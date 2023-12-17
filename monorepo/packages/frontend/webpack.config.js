// webpackの設定
const path = require('path');
const webpack = require('webpack');

module.exports = {
    // モード
    mode: 'development', // "production" | "development" | "none"

    // development に設定するとソースマップ有効でJSファイルが出力される
    devtool: "source-map", // *.js.mapが出力される

    // バンドルする粒度を制御
    // entry: {
    //     bundle1: path.join(__dirname, 'dst', 'bundle1', 'src1-1.js'),
    //     bundle2: path.join(__dirname, 'dst', 'bundle2', 'src2-1.js'),
    // },

    output: {
        path: path.join(__dirname, "public", "static", "js"),
        filename: '[name].js'
    },

    module: {
        rules: [
            // JSの場合
            {
                test: /\.js[x]?$/,
                use: [
                    'babel-loader',
                    'lint-loader'
                ],
                exclude: [
                    /node_modules/,
                    /src\//,
                    /dst\//
                ],
            },
            // TSの場合
            {
                test: /\.ts[x]?$/,
                use: [
                    'ts-loader',
                    'lint-loader'
                ],
                exclude: [
                    /node_modules/,
                    /src\//,
                    /dst\//
                ],
            },
            // CSSの場合
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
                exclude: [
                    /node_modules/,
                    /src\//,
                    /dst\//
                ],
            },
            // SASSの場合
            {
                test: /\.sass$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
                exclude: [
                    /node_modules/,
                    /src\//,
                    /dst\//
                ],
            }
        ]
    },

    // target: 'node',

    resolve: {
        extensions: [
            ".js", 
            ".jsx"
        ]
    },

    plugins: []
}