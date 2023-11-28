
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
const uncidi = require('uncidi'); // async request to URL
const dayjs = require('dayjs'); // Data


// 時間計測
void perfElapsedTime((func) => {
    const tp_start = perf.performance.now();
    func();
    const tp_end = perf.performance.now();
    console.log(`Elapsed time: ${pt_end - pt_start}[ms]`);
})


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

