// ----------------------------
// SNSサーバー
// ----------------------------
// CommonJS

// Node.js
const path = require('node:path');
const fps = require('node:fs/promises');
const fs = require('node:fs');
const perf = require('node:perf_hooks');
const crypt = require('node:crypto');
const stream = require('node:stream');
const zlib = require('node:zlib');
const process = require('node:process');
const assert = require('node:assert');
const childProcess = require('node:child_process');

// 3rd-party
const cors = require('cors');

// 自作
const account = require('./account');

// 時間計測
function perfElapsedTime(func) {
    const tp_start = perf.performance.now();
    func();
    const tp_end = perf.performance.now();
    console.log(`Elapsed time: ${pt_end - pt_start}[ms]`);
}

/* ----------- Shutdown Settings ----------- */

// GracefullShutdown : SIGTERM
const timeout = 30 * 1000; // 30秒
process.on('SIGTERM', () => {
    // Gracefull Shutdown開始
    console.log('Gracefull Shutdown...');
    // 新規リクエストの停止
    srvApp.close(() => {
        // 接続中のコネクションが全て終了したら実行される.
        console.log('Finish all requests');
    });

    const timer = setTimeout(() => {
        // タイムアウトによる強制終了
        process.exit(1);
    }, timeout);

    timer.unref();
});

function terminate() {
    console.log("Terminate shutdown...");
    process.exit(1); // これ必要.
}

// 強制終了 : SIGINT
process.on('SIGINT', () => {
    console.log('Recieved SIGINT');
    terminate();
});

/* ----------- Redis Settings ----------- */
const Redis = require("ioredis");

// Redis
const REDIS_PORT = 6379;
const redis = new Redis({
    port: REDIS_PORT,
    host: 'localhost',
    enableOfflineQueue: false
});

// Redisに格納するkv初期データ
const init = async () => {
    // Promise.allで同時にセット
    // await redis.set("test_wiki_1", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_1_です" }));
    // await redis.set("test_wiki_2", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_2_です" }));
    // await redis.set("test_wiki_3", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_3_です" }));
    // await redis.set("test_wiki_4", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_4_です" }));
    // await redis.set("test_wiki_5", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_5_です" }));
};

// Redis起動時にデータを格納して, Webサーバーを起動させる
redis.once('ready', async () => {
    try {
        // Redisにデータを格納
        await init();

        // サーバー起動
        app.listen(PORT, () => {
            console.log('Wiki application');
            console.log(`[Start] redis_server:${PORT} with redis: ${REDIS_PORT}`);
        });
    } catch (err) {
        console.error(err);
        terminate();
    }
});

// RedisにStreamでアクセスしてエラーが出た場合, Shutdown
redis.on('error', (err) => {
    console.error("[ERROR] Redis stream: ", err);
    terminate();
});

/* ----------- Express Settings ----------- */
const express = require("express");
const PORT = 3335;

// サーバー用インスタンスを作成
const app = express();

// 許可するオリジン
const allowCrossOrigins = [
    "http://localhost:3000"
];

// 許可するメソッド
const allowCrossOriginMethods = [
    "GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"
];

// 許可するヘッダー
const allowCrossOriginHeaders = [
    "content-type",
];

// クレデンシャル(Set-Cookie,Set-Cookie2など)の許可
const allowCrossOriginCredentials = true;

// preflightのキャッシュ有効期限
const allowCrossOriginMaxAge = 60; // 60秒

// クロスオリジンのパーミッション
const allowCORS = function (req, res, next) {
    console.log('[allowCORS] ----- START -----');
    console.log(`[Method] ${req.method}`);

    // CORSアクセスの場合, 必ずOriginヘッダーが存在する
    const origin = req.headers['origin'];
    console.log('origin:', origin);

    // リファラの確認(クライアント側がリファラ設定を許可していない場合がある)
    const referer = req.headers['referer'] ?? 'No referrer';
    console.log(`[Referrer] ${referer}`);

    // CORS経由のアクセスの場合, Originヘッダが必ず存在する
    if (!(origin == null)) {
        /* Originヘッダを確認したので, 下記スコープはCORS */

        // Access-Control-Allow-Origin : 許可するオリジンを設定
        if (allowCrossOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }

        // Access-Control-Allow-Credentials : クレデンシャルなヘッダの通信の可否
        // Set-Cookie, Set-Cookie2, Authenticationなど
        res.setHeader('Access-Control-Allow-Credentials', allowCrossOriginCredentials);

        // CORS経由でクライント(ブラウザ)のリクエストに設定できるヘッダを指定
        const acAllowList = [];

        // [Preflight Request]
        if (req.method === 'OPTIONS') {
            /* 単純でないCORSリクエストの定義 */
            // [GET,POST,HEAD]以外: [PUT,DELETE,CONNECTION,OPTIONS,TRACE,PATCH]
            // 下記以外のヘッダを持つ場合: 
            // [1] Accept
            // [2] Accept-Language 
            // [3] Content-Language
            // [4] Content-Type(text/plain,application/x-www-form-encoded,multipart/form-data)

            console.log('[OPTIONS] preflight request about CORS');
            console.log('--- Setting Specific Response Headers for preflight request ---');

            /* [Preflight Response]で以降の通信時に許可するメソッドとヘッダを定義する */
            console.log('[OPTIONS] preflight request about CORS');
            console.log('--- Setting Specific Response Headers for preflight request ---');

            // [1] Access-Control-Allow-Methodsの設定
            // Acces-Control-Allow-Methods(許可メソッド)を設定
            // Point. サーバ側の権限で許可メソッドを指定する.
            
            // Access-Control-Request-Methodの確認
            const acrm = req.headers['access-control-request-method'];
            console.log(`[Access-Control-Request-Method] ${acrm}`);

            const acrms = allowCrossOriginMethods.join(',');
            res.setHeader('Access-Control-Allow-Methods', acrms);

            // [2] Access-Control-Allow-Headersの設定
            // 下記はデフォルトで許可されている
            // Accept
            // Accept-Encoding
            // Accept-Language
            // Content-Type(text/plain, application/x-www-form-urlencoded, multipart/form-data)
            for (const allowHeader of allowCrossOriginHeaders) {
                if (acRequestList.includes(allowHeader)) {
                    // 該当すれば設定
                    acAllowList.push(allowHeader);
                }
            }
            const acAllowHeaders = acAllowList.join(',');
            console.log('[Access-Control-Allow-Headers] ', acAllowHeaders);
            res.setHeader('Access-Control-Allow-Headers', acAllowHeaders);

            // [3] Access-Control-Expose-Headerで, ブラウザに対してレスポンスヘッダの読み込み許可を指定する
            // 下記以外のヘッダがある場合,設定する
            // [1] Cache-Control
            // [2] Content-Language
            // [3] Content-Type(text/plain, application/x-www-form-urlencoded, multipart/form-data)
            // [4] Expires
            // [5] Last-Modified
            // [6] Params
            console.log('[Access-Control-Expose-Headers', acAllowHeaders);
            res.setHeader('Access-Control-Expose-Headers', acAllowHeaders);

            // [4] 再Preflight Requestまでのキャッシュ期限を設定
            res.setHeader('Access-Control-Max-Age', allowCrossOriginMaxAge);

            console.log('[Done] setting headers of preflight response');

            console.log('[allowCORS] ---------- Send 200 to browser ---------- ');

            return res.status(200).send();
        } // if (req.method === 'OPTIONS') {

        // Access-Control-Allow-HeadersでCORS確立後に
        // ブラウザに送信許可を与えるリクエストヘッダを設定する
        const acAllowHeaders = acAllowList.join(',');
        res.setHeader('Access-Control-Allow-Headers', acAllowHeaders);

    } // if (!(origin == null)) {

    console.log('[allowCORS] ---------- Next ---------- ');

    next();
};

app.use(allowCORS);

// 包括的エラーハンドリング(同期処理とnext関数の引数ににErrorを指定した場合のみ)
app.use((err, req, res, next) => {
    res.status(500).send('[ERROR] Internal Server with sync command\n');
});

// 非同期なエラーは包括的エラーハンドリングでキャッチできない
app.get("/async/err", async (req, res) => {
    throw new Error("非同期エラー"); // プロセス内でキャッチできないので、サーバーが落ちる.
});

// POST時のbodyのエンコード方式(3つ) 
// 1) application/x-www-form-encoded
// 2) multipart/form-data
// 3) application/json
// https://zenn.dev/bigen1925/books/introduction-to-web-application-with-python/viewer/post-parameters
// URLエンコード https://qiita.com/sisisin/items/3efeb9420cf77a48135d
// https://expressjs.com/en/4x/api.html#express.json
app.use(express.json()) // application/json形式に対応
app.use(express.urlencoded({ extended: true })) // request-bodyのurlencode形式に対応
// app.use(express.raw());

// ejsをビューエンジンに指定
app.set('view engine', 'ejs');

// ブラウザのURLリクエストに対して返信(公開)したいhtmlファイル,
// ディレクトリを指定する. ※ ReactRouterで指定されるURLに対して同じindex.htmlを返すようにする.
app.use('/', express.static('./public'));
app.use('/login', express.static('./public'))
app.use('/signup', express.static('./public'));
app.use('/users', express.static('./public'));
app.use('/timeline', express.static('./public'));


/* ----- APIを定義 ----- */

// ユーザの追加
app.post('/api/adduser', async (req, res) => {
    const userid = req.query.userid;
    const passwd = req.query.passwd;
    if (userid === '' || passwd === '') {
        console.log('[Server] パラメータが空です');
        return res.json({
            status: false,
            msg: 'パラメータが空です'
        });
    }

    // 既存ユーザのチェック
    const isExist = await account.getUser(userid, passwd);
    if (isExist) {
        return res.json({
            status: false,
            msg: '既にユーザがいます'
        });
    } else {
        try {
            // 新規追加
            const isSuccess = await account.setUser(userid, passwd);
            if (isSuccess) {
                console.log('[Server] 新規ユーザを追加しました');
                return res.json({
                    status: true,
                    msg: '新規ユーザを追加しました'
                });
            } else {
                console.log(`[Server] 新規ユーザの追加に失敗しました`);
                return res.json({
                    status: false,
                    msg: '新規ユーザの追加に失敗しました'
                });
            }
        } catch (e) {
            console.log('[Server] Failed to read redis db.');

            return res.json({
                status: false,
                msg: "Failed to read redis db."
            });
            // throw new Error('[Server] Failed to read redis db.');
        }
    }
});

// ユーザ認証して認証トークンを返す
app.get('/api/login', async (req, res) => {

});

// ユーザに友達を追加する

