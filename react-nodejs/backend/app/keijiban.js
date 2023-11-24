// -----------------------
// 掲示板アプリのWebサーバー側
// -----------------------
// CommonJS

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

// Redis起動時にデータを格納して, Webサーバーを起動させる
redis.once('ready', async () => {
    try {
        // Redisにデータを格納
        await init();

        // サーバー起動
        srvApp.listen(PORT, () => {
            console.log(`[Start] redis_server:${PORT} with redis: ${REDIS_PORT}`);
        });
    } catch (err) {
        console.error(err);
        terminate();
    }
});

/* ----------- Express Settings ----------- */
const express = require("express");
const PORT = 4000;

// サーバー用インスタンスを作成
const srvApp = express();

// クロスオリジンのパーミッション
const allowCORS = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); // すべてのオリジンを許可
    
    if (req.method == 'OPTIONS') {
        return res.status(200).send();
    } {
        next();
    }
};

// 非同期なエラーは包括的エラーハンドリングでキャッチできない
srvApp.get("/async/err", allowCORS, async (req, res) => {
    throw new Error("非同期エラー"); // プロセス内でキャッチできないので、サーバーが落ちる.
    console.log("async errルート");
    res.status(200).send("async errルート");
});

// 包括的エラーハンドリング(同期処理とnext関数の引数ににErrorを指定した場合のみ)
srvApp.use((err, req, res, next) => {
    res.status(500).send('[ERROR] Internal Server with sync command\n');
});

// RedisにStreamでアクセスしてエラーが出た場合, Shutdown
redis.on('error', (err) => {
    console.error("[ERROR] Redis stream: ", err);
    terminate();
});




/* ルーティング */

// publicディレクトリ以下は自動的に返す
srvApp.use('/public', express.static('./public'));

// ルートへのアクセスを/publicにリダイレクトする
srvApp.get('/', allowCORS, (req, res) => {
    // res.status(200).send('Hello Redis\n');
    res.redirect(302, '/public');

    console.log('GETメソッドを受け取りました.');
    console.log('-----');
});


// ログの取得
srvApp.get('/api/getItems', allowCORS, async (req, res) => {
    // データベースの書き込み時刻でソートして一覧を返す
    try {
        // Redisからレコードを取り出す
        const stream = redis.scanStream({
            match: '[0-9]*', // 時刻key
            count: 2 // 1回の呼び出しで2つ取り出す
        });
        const records = [] // Array<{ timestamp: 'time', comment : { name: 'name', msg: 'msg' }}}>;
        for await (const resultKeys of stream) {
            for (const key of resultKeys) {
                const value = await redis.get(key);
                const jsonStr = JSON.parse(value);
                records.push({ timestamp: key, comment: jsonStr});
            }
        }
        
        // タイムスタンプでソート(Redisの読み出しの順序は決まっていない)
        records.sort((left, right) => {
            const ts_left /* number */ = parseInt(left.timestamp, 10);
            const ts_right /* number */ = parseInt(right.timestamp, 10);
            return ts_left - ts_right;
        });

        console.log(records);
        res.status(200).json({ logs: records });
    } catch(err) {
        res.status(500).send('[ERROR] Internal Server: Failed to read all records to redis db.\n');
    }

    console.log('GETメソッドを受け取りました.');
    console.log('-----');
});

// 新規ログを書き込む
srvApp.post('/api/write', allowCORS, (req, res) => {
    // クエリURLパラメータ
    const query = req.query;

    try {
        // URLパラメータをDB(Redis)に書き込む
        // レコード: (名前, メッセージ, タイムスタンプ)
        const newRecord = {
            name: query.name,
            msg: query.msg
        };
        redis.set(Date.now().toString(), JSON.stringify(newRecord));
        
        console.log(`[Post] to redis DB: name=${query.name}, msg=${query.msg}`);
        res.status(200).send();

    } catch(err) {
        console.error(`[Error] write record to redis db. Query: ${query.name}=${query.body}`);
        res.status(500).send('[ERROR] Internal Server: Failed to write record to redis db.\n');
    }

    console.log('POSTメソッドを受け取りました.');
    console.log('-----');
});

// Redisに格納するkvデータ
const init = async () => {
    // Promise.allで同時にセット
    // await Promise.all([
    //     redis.set((new Date()).getTime().toString(), JSON.stringify({ name: "Aさん", msg: 'りんご' })),
    //     redis.set((new Date()).getTime().toString(), JSON.stringify({ name: "Bさん", msg: 'ごりら' })),
    //     redis.set((new Date()).getTime().toString(), JSON.stringify({ name: "Aさん", msg: 'ラッパ' })),
    //     redis.set((new Date()).getTime().toString(), JSON.stringify({ name: "Bさん", msg: 'パラオ' })),
    //     redis.set((new Date()).getTime().toString(), JSON.stringify({ name: "Cさん", msg: 'Oh my got!' })),
    // ]);

    await redis.set(Date.now().toString(), JSON.stringify({ name: "Aさん", msg: 'りんご' }));
    await redis.set(Date.now().toString(), JSON.stringify({ name: "Bさん", msg: 'ごりら' }));
    await redis.set(Date.now().toString(), JSON.stringify({ name: "Aさん", msg: 'ラッパ' }));
    await redis.set(Date.now().toString(), JSON.stringify({ name: "Bさん", msg: 'パラオ' }));
    await redis.set(Date.now().toString(), JSON.stringify({ name: "Cさん", msg: 'Oh my got!' }));


};



