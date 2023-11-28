
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
    await redis.set(Date.now().toString(), JSON.stringify());
    await redis.set(Date.now().toString(), JSON.stringify());
    await redis.set(Date.now().toString(), JSON.stringify());
    await redis.set(Date.now().toString(), JSON.stringify());
    await redis.set(Date.now().toString(), JSON.stringify());
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
const PORT = 3334;

// サーバー用インスタンスを作成
const app = express();

// クロスオリジンのパーミッション
const allowCORS = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // すべてのオリジンを許可

    if (req.method == 'OPTIONS') {
        return res.status(200).send();
    } {
        next();
    }
};

// 包括的エラーハンドリング(同期処理とnext関数の引数ににErrorを指定した場合のみ)
app.use((err, req, res, next) => {
    res.status(500).send('[ERROR] Internal Server with sync command\n');
});

// 非同期なエラーは包括的エラーハンドリングでキャッチできない
app.get("/async/err", allowCORS, async (req, res) => {
    throw new Error("非同期エラー"); // プロセス内でキャッチできないので、サーバーが落ちる.
});

// publicディレクトリを自動で返す
// APIではなく, 通常のWebアクセスをどのように処理するかを指定する.
// 下記は, `./public`直下にある静的なファイルを配信する設定.
// app.use('/wiki/:wikiname', express.static('./public'));
// app.use('/edit/:wikiname', express.static('./public'));

// POST時のbodyのエンコード方式(3つ) https://zenn.dev/bigen1925/books/introduction-to-web-application-with-python/viewer/post-parameters
// URLエンコード https://qiita.com/sisisin/items/3efeb9420cf77a48135d
// https://expressjs.com/en/4x/api.html#express.json
app.use(express.json()) // request-bodyのjson形式を受け取る
app.use(express.urlencoded({ extended: true })) // request-bodyのurlencode形式を受け取る
// app.use(express.raw());

/* ----- APIを定義 ----- */

// リダイレクト
app.get('/', allowCORS, async (req, res) => {
    res.redirect(302, 'wiki/FrontPage');
    console.log('リダイレクトしました.');
    console.log('-----');
});

// Wikiデータを返すAPI
app.get('/api/get/:wikiname', allowCORS, async (req, res) => {
    // DB(redis)からwikiname(key)に対応するHTMLドキュメント(value)を探す
    const wikiname = req.params.wikiname;
    try {
        // Redisからレコードを取り出す
        const record = redis.get(wikiname);
        if (record === null || record !== undefined) {
            res.json({ 
                status: false, 
                msg: `[Error] No found the document of key : ${wikiname}`
            });
        }

        const timestamp = record.timestamp;
        const text = record.doc;
        res.json({ 
            status: true, 
            name: wikiname, 
            record: { timestamp, text }
        });

    } catch(err) {
        res.json({
            status: false,
            msg: `[Error] Failed to load the doc of ${wikiname} from redis db.`
        });
    }
    
    console.log('GETメソッドを受け取りました.');
    console.log('-----');
});

// Wikiデータを書き込むAPI
app.post('/api/put/:wikiname', allowCORS, async (req, res) => {
    const wikiname = req.params.wikiname;
    console.log(`/api/put/${wikiname}`);
    console.log(`----- request body -----\n${req.body}\n`);
    console.log(`content-type: ${req.headers['content-type']}`);

    // json形式以外は受け付けない
    if (req.headers['content-type'] !== "application/json") {
        console.log("Content-Type is not `application/json`");
        return;
    }

    // 既存エントリーのチェック
    try {
        const stream = redis.scanStream({
            match: '*', // wikinameでもいいかも
            count: 4 // 1回に4チャンクを取り出す
        });

        const records = []; // Array<{name: 'wikiname', { timestamp: 'time', doc: 'text' }}>
        for await (const resultKeys of stream) {
            for (const key of resultKeys) {
                const value = await redis.get(key);
                // const record = JSON.parse(value);
                console.log('value:', value);
                const record = value; // json object
                records.push({ 
                    name: record.name, 
                    record: { 
                        timestamp: record.timestamp, 
                        doc: record.doc
                    }
                });
            }
        }

        const isExist = records.some((value, index, array) => {
            return value.name === wikiname;
        });

        // 既存エントリーがある場合は更新のために消す.
        if (isExist) {
            redis.delete(wikiname);
        }
        // const jsonObj = JSON.parse(req.body);
        const jsonObj = req.body; // 既にJSONに変換されている!
        console.log(`jsonObj:\n`, jsonObj);
        const text = jsonObj['doc'];
        redis.set(wikiname, { 
            timestamp: Date.now().toString(), 
            doc: text // html doc
        });
        
        const comment = isExist ? "更新しました." : "作成しました.";
        console.log(`Redis DBに ${wikiname} を` + comment);

        res.json({ status: true });

    } catch(err) {
        // res.status(500).send(`[Error] Failed to search ${wikiname} from redis db.\n`);

        console.error(err);

        res.json({
            status: false,
            msg: `[Error] Failed to search ${wikiname} from redis db.`
        });
    }

    console.log('POSTメソッドを受け取りました.');
    console.log('-----');
});


