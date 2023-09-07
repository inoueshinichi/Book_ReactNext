# Book_ReactNext
## Tutorial of React, Component-Orientation, Next.js for SPA, SSR, SSG and so on.

## TypeScriptとReact/Next.jsで作る実践アプリケーション開発
+ 書籍　https://gihyo.jp/book/2022/978-4-297-12916-3
+ サポートページ https://gihyo.jp/book/2022/978-4-297-12916-3/support
+ ソースコード1 https://github.com/gihyo-book/ts-nextbook-app
+ ソースコード2 https://github.com/gihyo-book/ts-nextbook-json
+ 正誤表 https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5DsuAjcbHuC38u3v4-rfnsmDthgSY4wrZiPvYNyAeuTYxLTzGUWiEgCD8vnv--w/pubhtml

## Version
+ Node.js v18.16.1
+ npm v9.5.1
+ TypeScript v5.1.6
+ @types/node v20.4.1

### TS Playground(REPLツール)
+ https://www.typescriptlang.org/play

### 目次

#### 1 Next.jsとTypeScriptによるモダン開発
+ 1.1 Next.jsとTypeScript
+ 1.2 フロントエンド開発の変遷
+ 1.2.1　JavaScript黎明期とjQueryの人気
+ 1.2.2　SPAの登場とMVC/MVVMフレームワーク
+ column.　SPA普及の裏で貢献したHistory API
+ 1.2.3　Reactの登場とコンポーネント指向・状態管理
+ 1.2.4　Node.jsの躍進
+ column.　CommonJSとESモジュール
+ column.　Deno
+ 1.2.5　AltJSの流行とTypeScriptの定番化
+ 1.2.6　ビルドツールとタスクランナー
+ 1.2.7　SSR/SSGの必要性
+ 1.2.8　Next.jsの登場と受容
+ 1.3 モダンフロントエンド開発の設計思想
+ 1.3.1　フロントエンド技術の複雑化
+ 1.3.2　コンポーネント指向とは
+ column.　FluxのライブラリRedux
+ 1.3.3　Next.jsがなぜ必要になってきているか
+ column.　Vue.jsとNuxt.js
+ column.　Next.jsの対応ブラウザ
+ column.　Reactコンポーネントの復元 - Hydration

#### 2 TypeScriptの基礎
+ 2.1 TypeScriptの基礎知識
+ 2.1.1　TypeScript登場の背景
+ 2.1.2　TypeScriptとVisual Studio Code
+ 2.1.3　TypeScriptとJavaScriptの違い
+ 2.1.4　TypeScriptコマンドラインツールによるコンパイル
+ 2.2 型の定義
+ 2.2.1　変数
+ 2.2.2　プリミティブ型
+ 2.2.3　配列
+ 2.2.4　オブジェクト型
+ 2.2.5　any
+ 2.2.6　関数
+ 2.3 基本的な型の機能
+ 2.3.1　型推論
+ 2.3.2　型アサーション
+ 2.3.3　型エイリアス
+ 2.3.4　インタフェース
+ 2.3.5　クラス
+ 2.4 実際の開発で重要な型
+ 2.4.1　Enum型
+ 2.4.2　ジェネリック型
+ 2.4.3　Union型とIntersection型
+ 2.4.4　リテラル型
+ 2.4.5　never型
+ 2.5 TypeScriptのテクニック
+ 2.5.1　Optional Chaining
+ 2.5.2　Non-null Assertion Operator
+ 2.5.3　型ガード
+ 2.5.4　keyofオペレーター
+ 2.5.5　インデックス型
+ 2.5.6　readonly
+ 2.5.7　unknown
+ 2.5.8　非同期のAsync/Await
+ 2.5.9　型定義ファイル
+ 2.6 TypeScriptの開発時設定
+ 2.6.1　tsconfig.json
+ 2.6.2　Prettier
+ 2.6.3　ESLint
+ 2.6.4　コンパイルオプション
+ column.　コーディングスタイルガイド
+ column.　TypeScriptのコンパイラ
+ column.　import type

#### 3 React/Next.jsの基礎
+ 3.1 React入門
+ 3.1.1　Reactの始め方
+ 3.1.2　Reactの基本
+ 3.1.3　Reactのコンポーネントを作成する
+ 3.2 Reactにおけるコンポーネント
+ 3.2.1　React要素
+ 3.2.2　コンポーネント（Reactコンポーネント）
+ column.　関数コンポーネントとクラスコンポーネント
+ 3.3 Reactにおける型
+ column.　FCとVFC
+ 3.4 Context（コンテキスト）
+ 3.5 React Hooks（フック）
+ 3.5.1　useStateとuseReducer―状態のフック
+ 3.5.2　useCallbackとuseMemo―メモ化のフック
+ 3.5.3　useEffectとuseLayoutEffect―副作用のフック
+ column.　React18におけるuseEffect・useLayoutEffectの挙動
+ 3.5.4　useContext―Contextのためのフック
+ 3.5.5　useRefとuseImperativeHandle―refのフック
+ 3.5.6　カスタムフックとuseDebugValue
+ 3.6 Next.js入門
+ 3.6.1　プロジェクトのセットアップ
+ 3.6.2　プロジェクトの基本的な構成
+ 3.7 Next.jsのレンダリング手法
+ 3.7.1　静的サイト生成（SSG）
+ 3.7.2　クライアントサイドレンダリング（CSR）
+ 3.7.3　サーバーサイドレンダリング（SSR）
+ 3.7.4　インクリメンタル静的再生成（ISR）
+ 3.8 ページとレンダリング手法
+ 3.8.1　Next.jsのページとデータ取得
+ 3.8.2　SSGによるページの実装
+ 3.8.3　getStaticPropsを用いたSSGによるページの実装
+ 3.8.4　getStaticPathsを使った複数ページのSSG
+ column.　useRouter―ルーティングのためのフック
+ 3.8.5　SSRによるページの実装
+ 3.8.6　ISRによるページの実装
+ 3.9 Next.jsの機能
+ 3.9.1　リンク
+ 3.9.2　画像の表示
+ 3.9.3　APIルート
+ 3.9.4　環境変数/コンフィグ
+ 3.9.5　React/Next.jsとライブラリの互換性

#### 4 コンポーネント開発
+ 4.1 Atomic Designによるコンポーネント設計
+ 4.1.1　Presentational ComponentとContainer Component
+ 4.1.2　Atomic Design
+ 4.1.3　Atoms
+ 4.1.4　Molecules
+ 4.1.5　Organisms
+ 4.1.6　Templates
+ 4.1.7　Pages
+ 4.2 styled-componentsによるスタイル実装
+ 4.2.1　styled-componentsをNext.jsに導入
+ 4.2.2　styled-componentsを用いたコンポーネント実装
+ 4.3 Storybookを使ったコンポーネント管理
+ 4.3.1　Storybookの基本的な使い方
+ 4.3.2　Actionを使用したコールバックのハンドリング
+ 4.3.3　Controlsタブを使ったpropsの制御
+ 4.3.4　アドオン
+ 4.4 コンポーネントのユニットテスト
+ 4.4.1　Reactにおけるユニットテスト
+ 4.4.2　テスト環境構築
+ 4.4.3　React Testing Libraryによるコンポーネントのユニットテスト
+ 4.4.4　非同期コンポーネントのユニットテスト
+ column.　Next.js 11以前のstyled-components/jest導入

#### 5 アプリケーション開発1～設計・環境設定～
+ 5.1 本章で開発するアプリケーション
+ 5.1.1　アプリケーションの仕様
+ 5.1.2　アプリケーションのアーキテクチャ
+ 5.2 開発環境構築
+ 5.2.1　Next.jsのプロジェクト作成
+ 5.2.2　styled-componentsの設定
+ 5.2.3　ESLintの設定
+ 5.2.4　Storybookの設定
+ 5.2.5　React Hook Formの導入
+ 5.2.6　SWRの導入
+ 5.2.7　React Content Loaderの導入
+ 5.2.8　Material Iconsの導入
+ 5.2.9　環境変数
+ 5.2.10　テスト環境構築
+ 5.2.11　JSON Serverの設定
+ 5.2.12　CSS in JSライブラリ

#### 6 アプリケーション開発2～実装～
+ 6.1 アプリケーションアーキテクチャと全体の実装の流れ
+ 6.2 APIクライアントの実装
+ 6.2.1　fetcher関数
+ 6.2.2　APIクライアントの関数
+ 6.2.3　アプリケーションで使用されるデータの型
+ 6.2.4　開発環境のためのAPIリクエストプロキシ
+ 6.3 コンポーネント実装の準備
+ 6.3.1　レスポンシブデザインに対応したコンポーネント
+ 6.3.2　Wrapperコンポーネントの実装
+ 6.4 Atomic Designによるコンポーネント設計の実施
+ 6.4.1　Atomic Designに沿ってコンポーネントを分割する
+ 6.5 Atomsの実装
+ 6.5.1　ボタン―Button
+ 6.5.2　テキスト―Text
+ 6.5.3　シェイプイメージ―ShapeImage
+ 6.5.4　テキストインプット―Input
+ 6.5.5　テキストエリア―TextArea
+ 6.5.6　バッジ―Badge
+ 6.6 Moleculesの実装
+ 6.6.1　チェックボックス―Checkbox
+ 6.6.2　ドロップダウン―Dropdown
+ 6.6.3　ドロップゾーン―Dropzone
+ 6.6.4　イメージプレビュー―ImagePreview
+ 6.7 Organismsの実装
+ 6.7.1　カート商品―CartProduct
+ 6.7.2　グローバルスピナー―GlobalSpinner
+ 6.7.3　ヘッダー―Header
+ 6.7.4　商品カード―ProductCard
+ column.　データURIスキーム
+ 6.7.5　商品投稿フォーム―ProductForm
+ 6.7.6　サインインフォーム―SigninForm
+ 6.7.7　ユーザープロファイル―UserProfile
+ 6.8 Templatesの実装
+ 6.8.1　レイアウト―Layout
+ 6.9 ページの設計と実装
+ 6.9.1　サインインページ
+ 6.9.2　ユーザーページ
+ 6.9.3　トップページ
+ 6.9.4　検索ページ
+ 6.9.5　商品詳細ページ
+ 6.9.6　買い物カートページ
+ 6.9.7　出品ページ
+ 6.10 コンポーネントのユニットテストの実装
+ 6.10.1　ボタンのユニットテスト
+ 6.10.2　ドロップダウンのユニットテスト
+ 6.10.3　ドロップゾーンのユニットテスト
+ 6.10.4　ヘッダーのユニットテスト
+ 6.10.5　サインインフォームのテスト
+ 6.10.6　商品投稿フォームのテスト

#### 7 アプリケーション開発3～リリースと改善～
+ 7.1 デプロイとアプリケーション全体のシステムアーキテクチャ
+ 7.2 Heroku
+ 7.3 Vercel
+ 7.3.1　Vercelへのアプリケーションのデプロイ
+ 7.4 ロギング
+ column.　ログレベル
+ 7.5 SEO
+ 7.5.1　メタタグ
+ 7.5.2　パンくずリスト
+ 7.5.3　sitemap
+ 7.5.4　robots.txt
+ 7.6 アクセシビリティ
+ 7.6.1　セマンティック
+ 7.6.2　補助テキスト
+ 7.6.3　WAI-ARIA
+ 7.7 セキュリティ
+ 7.7.1　フロントエンド開発における脆弱性とその対策
+ column.　CSRF
+ column.　Permissions-Policy
+ column.　X-XSS-Protectionヘッダー
+ column.　セキュリティテスト
+ column.　Next.jsのバックエンドの考え方
+ column.　Next.jsの認証

#### Appendix Next.jsのさらなる活用
+ A.1 決済ツールStripe
+ A.1.1　Stripeのセットアップ
+ A.1.2　Stripe APIの利用
+ A.1.3　Stripeの公式ドキュメント
+ A.2 StoryShots―UIスナップショットテスト
+ A.2.1　StoryShotsとは
+ A.2.2　storyshots-puppeteer―スナップショットイメージによるUIテスト
+ A.3 AWS AmplifyへのNext.jsアプリケーションのデプロイ
+ A.3.1　Next.jsアプリケーションのAWS Amplifyへのデプロイ
+ A.3.2　SSGを使用したNext.jsアプリケーションのAWS Amplifyへのデプロイ
+ A.4 国際化ツールi18n
+ A.4.1　パスによる言語ルーティング
+ A.4.2　next-i18nを使ったテキストのi18n対応





