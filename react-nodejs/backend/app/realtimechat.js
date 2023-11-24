// ---------------------------------
// リアルタムチャットアプリのWebサーバー側
// ---------------------------------
// CommonJS
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');


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


/* HTTPサーバーを作成(Reactアプリを送信する用) */
const PORT = 3333;
const app = express();
const httpSrv = http.createServer(app); // httpサーバー

// HTTPサーバーの起動
httpSrv.listen(PORT, () => {
    console.log(`[Start] HTTPサーバを起動しました. http://localhost:${PORT}`);
});

// publicディレクトリのファイルを自動で返す
app.use('/public', express.static('./public'));

// ルートへのアクセスをpublicにリダイレクトする
app.get('/', (req, res) => {
    res.redirect(302, '/public');
});

/* WebSocketサーバーを起動 */
// Socket.IOでは, もしWebSocketが使えない場合, HTTPで擬似的な双方向通信を行うため,
// Socket.IOのサーバーオブジェクトを生成する際, HTTPサーバーのオブジェクトを与える.
const socketOptions = {
    cors: {
        origin: '*'
    },
    credential: false
}

// socketio -> socket.io を使う. https://qiita.com/mtbforq/questions/cb93e467d4890e319c6f
const wsio /* Stream */ = socketIo(/* HTTPサーバ */ httpSrv, /* オプション */ {
        cors: {
            origin: '*'
        },
        credential: false
    });

// WebSocket用のsocket.ioライブラリでは, "connection"メッセージ以外になさそう
// wsio.once('ready', async () => {
//     console.log("[Starg] WebSocketサーバを起動しました");
// });

// クライアントが接続したときのイベントを設定
wsio.on('connection', (socket) => {

/* テンプレート
    // クライアントがメッセージを受信したときの処理
    socket.on(メッセージの種類, (msg) => {
        // 特定のメッセージを受信したときの処理をここに記述
    });
*/

    console.log('[Connection] ユーザが接続:', socket.client.id);

    // メッセージ受診時の処理を記述
    socket.on('toAPI', (msg) => {
        console.log('メッセージ', msg);
        // すべてのクライアントに送信(ブロードキャスト)
        socket.emit('fromAPI', msg);
    });

    // クライアントが接続解除したときのイベント設定
    socket.on('disconnect', (reason) => {
        console.log('[Client dissconnect] ユーザが接続解除:', reason);
    });

});



