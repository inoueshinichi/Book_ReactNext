# Learn_ReactNext
## Tutorial of React, Component-Orientation, Next.js for SPA, SSR, SSG and so on.

## Version
+ Node.js v18.16.1
+ npm v9.5.1
+ TypeScript v5.1.6
+ @types/node v20.4.1

### TS Playground(REPLツール)
+ https://www.typescriptlang.org/play

## 書籍

### TypeScriptとReact/Next.jsで作る実践アプリケーション開発
+ 書籍　https://gihyo.jp/book/2022/978-4-297-12916-3
+ サポートページ https://gihyo.jp/book/2022/978-4-297-12916-3/support
+ ソースコード1 https://github.com/gihyo-book/ts-nextbook-app
+ ソースコード2 https://github.com/gihyo-book/ts-nextbook-json
+ 正誤表 https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5DsuAjcbHuC38u3v4-rfnsmDthgSY4wrZiPvYNyAeuTYxLTzGUWiEgCD8vnv--w/pubhtml

### いまどきのJSプログラマーのためのNode.jsとReactアプリケーション開発テクニック
+ 書籍 https://www.socym.co.jp/book/1114


## Babel(もう使わないけど一応)

### ES2020をES6(ES2015)以前のプログラムに変換

#### Babelインストール
+ `$ npm install --save-dev babel-cli babel-preset-es2020`
+ `$ npx babel --presets=es2020 {path/to/your_es2020.js} [--watch|-w]  [--out-file|-o] {path/to/your_compiled.js}`