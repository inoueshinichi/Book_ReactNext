// Monorepo Backend
// API Server
// CommonJS

// 自作
const { wrapAPIWithReturnJson } = require('./handlers/errorhandlers');
const usersHandler = require('./handlers/users');
const MyError = require('./handlers/errors');
const redis = require("./lib/redis");
const { expressConfig } = require('./express.config');

// Node.js
const path = require('node:path');
const fsp = require('node:fs/promises');
const fs = require('node:fs');
const assert = require('node:assert');
const perf = require('node:perf_hooks');
const stream = require('node:stream');
const crypt = require('node:crypto');
const zlib = require('node:zlib');
const process = require('node:process');

// 3rd
const express = require('express');
const marked = require('marked');
const cors = require('cors');
const dayjs = require('dayjs');
const jsCookie = require('js-cookie');
const multer = require('multer');
const ioredis = require('ioredis');
const dotenv = require('dotenv');

// performance
const heapdump = require('heapdump');

// 時間計測
const perfElapsedTime = (fn) => {
    const tp_start = perf.performance.now();
    fn();
    const tp_end = perf.performance.now();
    console.log(`Elapsed time: ${pt_end - pt_start}[ms] at ${fn} func.`);
};

/* ----------- Shutdown Settings ----------- */

function terminate() {
    console.log("Terminate shutdown...");
    process.exit(1); // これ必要.
}

// Gracefull-Shutdown : SIGTERM
process.on('SIGTERM', () => {
    // Gracefull Shutdown開始
    console.log('Gracefull Shutdown...');

    // 新規リクエストの停止
    app.close(() => {
        // 接続中のコネクションが全て終了したら実行される
        console.log(`Finish all requests`);
    });

    // タイムアウト30秒で強制終了
    const timer = setTimeout(() => {
        // 強制終了
        terminate();
    }, 30 * 1000);

    timer.unref();
});

// 強制終了 : SIGINT
process.on('SIGINT', () => {
    console.log('Recieved SIGINT');
    terminate();
});

/* ----------- Redis Settings ----------- */

redis.connect()
    .once('ready', async () => {
        console.log('connecting redis db ...');
        try {
            await redis.init();

            app.listen(expressConfig.port, () => {
                console.log('[OK] finish connecting redis db.');
                console.log(`starting express server with listening ${expressConfig.port} port`);
            });

        } catch (err) {
            console.error(err);
            terminate();
        }
    })
    .on('error', (err) => {
        console.error(err);
        terminate();
    });

// redis.on('error', (err) => {
//     console.error(err);
//     terminate();
// });

/* ----------- Express Setting ----------- */
const app = express();

// 公開フォルダを設定
app.use(express.static(path.join(__dirname, "public")));

/* SSR エンジン */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// POST時のbodyのエンコード方式(3つ) 
// 1) application/x-www-form-encoded
// 2) multipart/form-data
// 3) application/json
// https://zenn.dev/bigen1925/books/introduction-to-web-application-with-python/viewer/post-parameters
// URLエンコード https://qiita.com/sisisin/items/3efeb9420cf77a48135d
// https://expressjs.com/en/4x/api.html#express.json

// application/x-www-form-encoded形式に対応
app.use(express.urlencoded({ extended: true }));

// multipart/form-data形式に対応
const multerStorage = multer.diskStorage({
    destination: path.join(__dirname, "public", "static", "media", "image"),
    filename: (req, file, callback) => {
        callback(null, file.filename + "-" + Date.now() + path.extname(file.originalname));
    }
});
const multerUpload = multer({ storage: multerStorage });

// application/json形式に対応
app.use(express.json());


// 包括的エラーハンドリング
app.use((err, req, res, next) => {

    /* 独自例外によるエラーハンドリング */
    if (err instanceof MyError.BadRequest) {
        console.log('[BadRequest]', req);
        res.status(err.status).send(err.message);
        return;
    }

    if (err instanceof MyError.NotFoundHTML) {
        console.log('[NotFoundHTML]', req);
        res.status(err.status).send('<html><body>Not Found!</body></html>');
        return;
    }

    // 例外キャッチできなかった場合の最終手段
    res.status(500).send('Internal Server Error');
    console.error('[Internal Server Error]', err);
});

/* ----------- Memory Checking ----------- */

// 2000ms毎にGCを実行
// setInterval(() => {
//     try {
//         global.gc();
//     } catch (e) {
//         console.log('use --expose-gc');
//         terminate();
//     }
//     const usedHeap = process.memoryUsage().heapUsed;
//     console.log(`Heap: ${usedHeap} bytes`);
// }, 2000);

// ヒープダンプ
process.on('SIGUSR2', () => {
    console.log('[START] heat dump!');
    heapdump.writeSnapshot(); // ヒープダンプファイル(heapdump-xxxxx)を取得
    console.log('[END] heat dump!');
});


/* ----------- Express API ----------- */

app.get('/', (req, res) => {
    res.redirect(302, '/public');

    console.log('GETメソッドを受け取りました.');
    console.log('-----');
});

// SSR
app.get('/view', (req, res) => {
    res.render(path.join(__dirname, "views", "index.ejs"));
});

const corsOptions = {
    // 許可するリクエストオリジン (Access-Control-Allow-Origin)
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    // 許可するリクエストメソッド (Access-Control-Allow-Methods)
    methods: ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS', 'TRACE', 'PATCH', 'CONNECT'],
    // クレデンシャルヘッダを含めるかの成否 (Access-Control-Allow-Credentials)
    credentials: true,
    // 許可するリクエストヘッダ (Access-Control-Allow-Headers) ※ 指定しない場合, Access-Control-Request-Headersをそのまま反映.
    allowedHeaders: ['Content-Type'],
    // リクエスト側(ブラウザ側)に読み取り許可をするヘッダを指定 (Access-Control-Expose-Headers)
    exposedHeaders: ['Content-Type', 'Content-Length'],
    // Access-Control-Max-Age (次回のPreflight Requestまでのキャッシュ時間)
    maxAge: 5/*秒*/, // preflight requestを送信しない秒数
    // Preflight Request成功時に返すステータスコード
    optionsSuccessStatus: 204,
    // 次のミドルウェアにPreflight Requestを渡す成否
    preflightContineu: true
};

// PreflightをすべてのURLに許可
app.options('*', cors(corsOptions));

// app.get('/user/:id', async (req, res) => {
app.get('/api/user/:id', cors(corsOptions), async (req, res) => {
    try {
        const user = await usersHandler.getUser(req);
        res.status(200).json(user);
    } catch (err) {
        // getUserがPromise<Reject>を出力するとtry-catchでBadRequest例外を上位にスローする
        // 包括的エラーハンドリング関数側でレスポンスを返す構造
        throw new BadRequest('[Fail] getUser()');
    }
});

// app.get('/users', async (req, res) => {
app.get('/api/users', cors(corsOptions), async (req, res) => {
    console.log('[Request Method]', req.method);
    console.log('[Request Headers]', req.headers);

    try {
        const users = await usersHandler.getUsers(req);
        // SSR
        // res.render(path.join(__dirname, 'views', 'users.ejs'), users);

        // JSON
        res.status(200).json(users);
    } catch (err) {
        throw new BadRequest('[Fail] getUsers()');
    }
});

// クライアント(ブラウザ)側からJSONデータを受け取るAPI
app.post('/api/post', cors(corsOptions), async (req, res) => {
    console.log('[Request Method]', req.method);
    console.log('[Request Headers]', req.headers);

    console.log('----- JSON -----');
    const jsonObj = req.body;
    const jsonStr = JSON.stringify(jsonObj);
    console.log(jsonObj);
    console.log(jsonStr);

    res.status(200).json({ status: true });
});
