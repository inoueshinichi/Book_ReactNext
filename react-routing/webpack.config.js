const path = require('path');
const webpack = require('webpack');

module.exports = {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: 'development', // "production" | "development" | "none"

    devtool: "source-map", // *.js.mapが出力される

    entry: {
        index_bundle: path.join(__dirname, 'src', 'index.js')
    },

    output: {
        path: path.resolve(__dirname, 'public', 'static', 'js'),
        filename: '[name].js'
    },

    // target: 'node',

    resolve: {
        extensions: [".js", ".jsx"]
    },

    module: {
        rules: [
            // JSの場合
            {
                test: /\.js[x]?$/,
                loader: 'babel-loader',
                exclude: [
                    /node_modules/,
                ],
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                    ]
                }
            },
            // CSSの場合
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    }
};