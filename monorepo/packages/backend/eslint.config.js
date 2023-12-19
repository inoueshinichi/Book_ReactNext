// eslintの設定

module.exports = {
    extends: [
        'plugin:node/recommended',
    ],
    env: {
        commonjs: true,
        es2022: true,
        node: true
    },
    perserOptions: {
        ecmaVersion: 12
    },
    rules: {
        quotes: ['error', 'single', 'double']
    },
    files: ["./**/*.js"],
    ignores: ["./*.config.js"],
};