const path = require('path');

module.exports = {
    entry: './dist/main.js',
    output: {
        path: path.resolve(__dirname, 'build', 'bandle'),
        filename: 'main_bandle.js'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ]
                    }
                },
                exclude: /node_modules/
            },
        ]
    }
};