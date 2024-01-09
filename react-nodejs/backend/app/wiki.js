
// ---------------------------------
// Wikiアプリサーバ
// ---------------------------------
// CommonJS

// Node.js
const path = require('path');
const fsp = require("fs/promises");
const fs = require('fs');
const perf = require('perf_hooks');
const crypt = require('crypto');
const stream = require('stream');
const zlib = require('zlib');
const process = require('process');
const http = require('http'); // http web server and request
const childProcess = require('child_process');

// 3rd-party
const cookieParser = require("cookie-parser");
const markd = require("markd"); // markdown
const dayjs = require('dayjs'); // Data


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
    await redis.set("test_wiki_1", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_1_です" }));
    await redis.set("test_wiki_2", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_2_です" }));
    await redis.set("test_wiki_3", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_3_です" }));
    await redis.set("test_wiki_4", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_4_です" }));
    await redis.set("test_wiki_5", JSON.stringify({ timestamp: Date.now().toString(), doc: "wiki_5_です" }));
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
    
    console.log('[allowCORS] ---------- START ---------- ');
    console.log(`[Method] ${req.method}`);
    
    const origin = req.headers['origin'];
    console.log('origin: ', origin);

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
        // res.setHeader('Access-Control-Allow-Origin', '*'); // すべてのオリジンを許可(暫定)

        // Access-Control-Allow-Credentials : クレデンシャルなヘッダの通信の可否
        // Set-Cookie, Set-Cookie2, Authenticationなど
        res.setHeader('Access-Control-Allow-Credentials', allowCrossOriginCredentials);

        // CORS経由でクライアント(ブラウザ)のリクエストに設定できるヘッダを指定
        const acAllowhList = [];
        
        // [Preflight Request]
        if (req.method === 'OPTIONS') {
            // [GET,POST,HEAD]以外: [PUT,DELETE,CONNECTION,OPTIONS,TRACE,PATCH]
            // 下記以外のヘッダを持つ場合: 
            // [1] Accept
            // [2] Accept-Language 
            // [3] Content-Language
            // [4] Content-Type(text/plain,application/x-www-form-encoded,multipart/form-data)

            console.log('[OPTIONS] preflight request about CORS');
            console.log('--- Setting Specific Response Headers for preflight request ---');

            // Access-Control-Request-Methodの確認
            const acrm = req.headers['access-control-request-method'];
            console.log(`[Access-Control-Request-Method] ${acrm}`);

            // Acces-Control-Allow-Methods(許可メソッド)を設定
            // Point. サーバ側の権限で許可メソッドを指定する.
            // if (allowCrossOriginMethods.includes(acrm)) {
            //     // 該当すれば...設定
            //     res.setHeader('Access-Control-Allow-Methods', acrm);
            // }
            const acrms = allowCrossOriginMethods.join(',');
            res.setHeader('Acess-Control-Allow-Methods', acrms);
            
            // Access-Control-Request-Headersの確認
            const acrhs = req.headers['access-control-request-headers'];
            console.log(`[Access-Control-Request-Headers] ${acrhs}`);
            const acRequesthList = acrhs.split(',');
            
            /* Access-Control-Allow-Headersでブラウザに許可するヘッダ-を追加する */
            // CORS通信確立後にクライアントからのリクエストのヘッダに許可を出す
            // 下記はデフォルトで許可されている
            // Accept
            // Accept-Encoding
            // Accept-Language
            // Content-Type(text/plain, application/x-www-form-urlencoded, multipart/form-data)
            for (const allowHeader of allowCrossOriginHeaders) {
                if (acRequesthList.includes(allowHeader)) {
                    // 該当すれば...設定
                    acAllowhList.push(allowHeader);
                }
            }
            const acAllowHeaders = acAllowhList.join(',');
            console.log('[Access-Control-Allow-Headers] ', acAllowHeaders);
            res.setHeader('Access-Control-Allow-Headers', acAllowHeaders);

            // Access-Control-Allow-HeadersがCORS確立後に送信したいヘッダを示すのに対して,
            // Access-Control-Expose-Headerは, サーバ側が設定したヘッダをブラウザ側が読み出せるようにする.
            // 下記以外のヘッダがある場合,設定する
            // [1] Cache-Control
            // [2] Content-Language
            // [3] Content-Type(text/plain, application/x-www-form-urlencoded, multipart/form-data)
            // [4] Expires
            // [5] Last-Modified
            // [6] Params
            console.log('[Access-Control-Expose-Headers', acAllowHeaders);
            res.setHeader('Access-Control-Expose-Headers', acAllowHeaders);

            // 再preflightリクエストまでのキャッシュ期限
            res.setHeader('Access-Control-Max-Age', allowCrossOriginMaxAge);

            console.log('[Done] setting headers of preflight response');

            console.log('[allowCORS] ---------- Send 200 to browser ---------- ');

            return res.status(200).send();
        } // if (req.method === 'OPTIONS') {

        // Access-Control-Allow-Headersでブラウザに許可するヘッダ-を追加する(preflight以降も必要)
        const acAllowHeaders = acAllowhList.join(',');
        res.setHeader('Access-Control-Allow-Headers', acAllowHeaders);
    }

    console.log('[allowCORS] ---------- Next ---------- ');

    // console.log('[Res Headers]: ', res.headers)

    next();
};

app.use(allowCORS);

// Request&Response ヘッダーをログ表示
const showHeaders = function(req, res, next) {
    const referer = req.headers['referer'];
    const host = req.headers['host'];
    console.log(`[Access] from ${referer} to ${host}`);

    // console.log('---------- Request Headers ----------');
    // for (const [key, value] of Object.entries(req.headers)) {
    //     if (key == null || value == null) continue;
    //     console.log(`[Req Header] ${key}=${value}`);
    // }

    // console.log('---------- Response Headers ----------');
    // for (const [key, value] of Object.entries(res.headers)) {
    //     if (key == null || value == null) continue;
    //     console.log(`[Res Header] ${key}=${value}`);
    // }

    next();
}

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

/* ----- APIを定義 ----- */

// publicディレクトリのindex.htmlに自動リダイレクト
// APIではなく, 通常のWebアクセスをどのように処理するかを指定する.
// 下記は, `./public`直下にある静的なファイルを配信する設定.
// app.use('/home', express.static('./public'));
// app.use('/edit/:wikiname', express.static('./public'));

const FRONTEND_PORT = 3000;
const myApiServerUrl = `http://localhost:${PORT}`;
const reactServerUrl = `http://localhost:${FRONTEND_PORT}`;

// Root: SSR
app.get('/', showHeaders, async (req, res) => {
    console.log('[Access] /');

    res.render(path.join(__dirname, "views", "index.ejs"), {
        params: { name: 'Home画面' }
    });

    console.log('Server Side Rendering : index.ejs');
    console.log('GETメソッドを受け取りました.');
    console.log('---\n');
});

// Reactフロントエンドの配信サーバにリダイレクトする
app.get('/wiki/:wikiname', showHeaders, (req, res) => {
    const wikiname = req.params.wikiname;

    console.log(`[Access] /wiki/${wikiname}`);

    // リダイレクト時にCookieを付与
    const userId = "0123456789";
    console.log(`[UserId] ${userId}`)
    res.cookie('UserId', userId);

    // Redirect
    const url = `${reactServerUrl}/wiki/${wikiname}`;
    res.redirect(/* Moved Permanently */301, url);
    console.log(`[Redirect] ${url}`);

    console.log('GETメソッドを受け取りました.');
    console.log('---\n');
});

// Wikiデータ一覧を取得
app.get("/api/all", showHeaders, async (req, res) => {

    console.log(`[Access] /api/all`);

    try {
        // Redisからレコードを取り出す
        const stream = redis.scanStream({
            match: '*', // key
            count: 2 // 1回の呼び出しで2つ取り出す
        });
        const records = []; // Array<{ name: "wikiname", record: { timestamp: 'time', doc: 'content'}}>
        for await (const resultKeys of stream) {
            for (const key of resultKeys) {
                const jsonStr = await redis.get(key);
                const jsonObj = JSON.parse(jsonStr);
                const record = { timestamp: jsonObj.timestamp, doc: jsonObj.doc };
                records.push({ name: key, record: record });
            }
        }

        console.log("records", records);
        res.status(200).json(records);

    } catch (err) {
        console.error(err);
        res.status(500).send(`[Error] Failed to get all key list from redis db.\n`);
    }


    console.log('GETメソッドを受け取りました.');
    console.log('---\n');
});

// Wikiデータを返すAPI
app.get('/api/get/:wikiname', showHeaders, async (req, res) => {
    // DB(redis)からwikiname(key)に対応するMarkdownドキュメント(value)を探す

    const wikiname = req.params.wikiname;

    console.log(`[Access] /api/get/${wikiname}`);

    try {
        // Redisからレコードを取り出す
        const jsonStr = await redis.get(wikiname);
        const jsonObj = JSON.parse(jsonStr);
        const timestamp = jsonObj.timestamp;
        const doc = jsonObj.doc;

        console.log(`[Redis DB] fetch key=${wikiname}`);
        console.log("timestamp ", timestamp);
        console.log("doc ", doc);

        /* jsonStr === null or jsonStr === undefined */
        if (jsonStr == null) {
            res.json({ 
                status: false, 
                name: wikiname,
                record: { timestamp: "", markdown: "" }
            });
            return;
        }

        res.json({ 
            status: true, 
            name: wikiname, 
            record: { timestamp: timestamp, markdown: doc }
        });

    } catch(err) {
        console.error(err);

        res.json({
            status: false,
            msg: `[Error] Failed to load the doc of ${wikiname} from redis db.`
        });
    }
    
    console.log('GETメソッドを受け取りました.');
    console.log('---\n');
});

// Wikiデータを書き込むAPI
app.post('/api/put/:wikiname', showHeaders, async (req, res) => {
    const wikiname = req.params.wikiname;

    console.log(`[Access] /api/pul/${wikiname}`);
    console.log(`content-type: ${req.headers['content-type']}`);
    console.log(`----- request body -----`);
    console.log(JSON.stringify(req.body));
    

    // json形式以外は受け付けない
    if (req.headers['content-type'] !== "application/json") {
        console.log("Content-Type must be `application/json`");
        return res.status(/* Unsupported Media Type */415).send();
    }

    // 既存エントリーのチェック
    try {
        const stream = redis.scanStream({
            match: '*', // wikinameでもいいかも
            count: 2 // 1回2チャンクを取り出す
        });

        const records = []; // Array<{ name: string }>
        for await (const resultKeys of stream) {
            for (const key of resultKeys) {
                records.push({ 
                    name: key
                });
            }
        }

        // 既存エントリーがあるかチェック
        const isExist = records.some((value, index, array) => {
            return value.name === wikiname;
        });

        // 既存エントリーがある場合は更新のために消す.
        let existRecord = null; // { timestamp: "date", doc: "content" }
        if (isExist) {
            existRecord = await redis.get(wikiname); // json string
            existRecord = JSON.parse(existRecord);
            redis.del(wikiname);
            console.log(`[Delete] ${wikiname} : ${existRecord}`);
        }

        console.log(isExist ? "[Update]" : "[Create]");
        console.log(`[Redis DB] key=${wikiname}, value=${existRecord}`);

        const jsonObj = req.body; // 既にJSONに変換されている!
        console.log(`jsonStr:\n`, JSON.stringify(req.body));
        const timestamp = Date.now().toString();
        const mdText = jsonObj['doc']; // markdonw

        console.log(`[Set] timestamp`, timestamp);
        console.log(`[Set] markdown`, mdText);

        await redis.set(wikiname, JSON.stringify({ timestamp: timestamp, doc: mdText }));
        
        res.json({ 
            status: true,
            msg: `[Success] key=${wikiname}, value=${mdText} on Redis DB.`
        });

    } catch(err) {
        // res.status(500).send(`[Error] Failed to search ${wikiname} from redis db.\n`);

        console.error(err);

        res.json({
            status: false,
            msg: `[Fail] key=${wikiname} on Redis DB.`
        });
    }

    console.log('POSTメソッドを受け取りました.');
    console.log('---\n');
});


