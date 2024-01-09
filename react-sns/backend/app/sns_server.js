// ----------------------------
// SNSサーバー
// ----------------------------
// CommonJS

// Node.js
const path = require('node:path');
const fps = require('node:fs/promises');
const fs = require('node:fs');

const crypt = require('node:crypto');
const stream = require('node:stream');
const zlib = require('node:zlib');
const process = require('node:process');
const assert = require('node:assert');
const childProcess = require('node:child_process');

// 3rd-party
// const cors = require('cors');

// 自作
const account = require('./account');
const cors = require('./cors');
const config = require('./config');

/* ----------- Shutdown Settings ----------- */

// GracefullShutdown : SIGTERM
const timeout = 30 * 1000; // 30秒
process.on('SIGTERM', () => {
    // Gracefull Shutdown開始
    console.log('Gracefull Shutdown...');
    // 新規リクエストの停止
    app.close(() => {
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

/* ----------- Express Settings ----------- */
const express = require("express");

// サーバー用インスタンスを作成
const app = express();

// cors
app.use(cors.allowCORS);

// 包括的エラーハンドリング
app.use((err, req, res, next) => {

    /* 独自例外によるエラーハンドリング */
    if (err instanceof BadRequest) {
        console.log('[BadRequest]', req);
        res.status(err.status).send(err.message);
        return;
    }

    if (err instanceof NotFoundHTML) {
        console.log('[NotFoundHTML]', req);
        res.status(err.status).send('<html><body>Not Found!</body></html>');
        return;
    }

    res.status(500).send('Internal Server Error');
    console.error('[Internal Server Error]', err);
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

// ------------------------------------
const db = require('./db');


// DB接続
const redisClient = db.connectRedis();
const postgreClient = db.connectPostgre();

redisClient.once('ready', async () => {
    console.log("[Initialization]");
    try {
        // 初期化
        await db.initRedisDB();
        await db.initPostgreDB();

        // サーバ起動
        app.listen(config.expressConfig.port, () => {
            console.log('[Start] SNS application');
            console.log(`[Redis] redis_server >> host: ${config.redisConfig.host}, port: ${config.redisConfig.port}`);
            console.log(`[Postgre] postgre_server >> host: ${config.postgreConfig.host}, port: ${config.postgreConfig.port}`);
        });

    } catch (e) {
        console.error(e);
        terminate();
    }
});

redisClient.on('error', (e) => {
    console.error(e);
    terminate();
});


/* ----- APIを定義 ----- */

// ユーザの追加
app.post('/api/adduser', async (req, res) => {

    // クエリ
    const userid = req.query.userid;
    const passwd = req.query.passwd;

    if (userid === '' || passwd === '') {
        console.log('[Server] パラメータが空です');
        return res.json({
            status: false,
            msg: 'パラメータが空です'
        });
    }

    try {
        // ユーザ情報の取得
        let userInfo = await account.getUer(userid, passwd);

        if (!(userInfo == null)) {
            console.log('既に登録済みのユーザ');
            return res.json({
                status: false,
                msg: '既に登録済みのユーザ'
            });
        }

        // 新規追加
        userInfo = await account.setUser(userid, passwd);
        console.log('[Server] 新規ユーザを追加しました');
        console.log('userInfo', userInfo);
        return res.json({
            status: true,
            msg: '新規ユーザを追加しました'
        });

    } catch (e) {
        console.log('PostgreDBのアクセスに失敗');
        return res.json({
            status: false,
            msg: 'PostgreDBのアクセスに失敗'
        });
    }
});

// ユーザログインを成功したら認証トークンを返す
app.get('/api/login', async (req, res) => {

    // クエリ
    const userid = req.query.userid;
    const passwd = req.query.passwd;

    try {
        // DBのUser情報を参照
        const token = await account.loginUser(userid, passwd);

        // ログイン成功時に認証トークンをブラウザに返す
        return res.json({
            status: true,
            token
        });
    } catch (e) {
        // ログイン失敗
        console.log('DB認証エラー', e);
        return res.json({
            status: false,
            msg: 'DB認証エラー'
        });
    }
});

// ユーザに友達を追加する
app.post('/api/add_friend', async (req, res) => {

    // クエリ
    const userid = req.query.userid;
    const token = req.query.token;
    const friendid = req.query.friendid;

    // 認証
    const isSuccess = await account.checkToken(userid, token);
    if (!isSuccess) {
        console.log('DB認証エラー', e);
        res.json({
            status: false,
            msg: 'DB認証エラー'
        });
    }

    // 友達を追加
    try {
        await account.addUserFriend(userid, friendid);
        console.log('友達登録完了')
        return res.json({
            status: true
        });
    } catch (e) {
        console.log(`既に友達登録済みです. UserID: ${userid}, FriendID: ${friendid}`);
        return res.json({
            status: false,
            msg: '既に友達登録済み'
        });
    }
});

// すべてのユーザを列挙して返す
app.get('/api/get_allusers', async (req, res) => {

    // クエリ
    const userid = req.query.userid;
    const token = req.query.token;

    // 認証
    const isSuccess = await account.checkToken(userid, token);
    if (!isSuccess) {
        console.log('DB認証エラー', e);
        res.json({
            status: false,
            msg: 'DB認証エラー'
        });
    }

    try {
        const userInfoList = await account.getUsers();
        const userIdList = userInfoList.map(userInfo => userInfo.userid);
        console.log(`User ID List: ${userIdList}`);
        return res.json({
            status: true,
            userIdList
        });
    } catch (e) {
        // ログイン失敗
        console.log('友達情報の取得失敗', e);
        return res.json({
            status: false,
            msg: '友達情報の取得失敗'
        });
    }
});

// // 自分のタイムラインにコメントを書き込む
// app.post('/api/add_timeline', async (req, res) => {
//     console.log("未実装");
// });

// // 自分と友達のタイムラインを返す
// app.get('/api/get_friends_timeline', async (req, res) => {
//     console.log("未実装");
// });

// // ユーザ情報(友達一覧)を返す
// app.get('/api/get_user', async (req, res) => {

//     // クエリ
//     const userid = req.query.userid;

//     console.log("未実装");
// });