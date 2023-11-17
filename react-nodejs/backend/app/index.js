// ExpressによるWebAPI

// 環境変数
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
const PORT = process.env.SERVER_PORT;
const ADDR = process.env.SERVER_ADDRESS;

const postURL = "/post";

// POST内容を解析するbody-parserを有効にする
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// NodeJS
const path = require('path');
const fsp = require("fs/promises");
const fs = require('fs');

// どこにアップロードするか指定
const mediaImageDir = path.join(__dirname, "public", "media", "image");
const mediaImageURL = "/image/upload";

// Uploadされたファイルを受け取るライブラリ
const multer = require('multer'); // `multipart/form-data` of HTTP <form>
// const uploader = multer({ dest: mediaImageDir + "/" });
//Set Storage Engine
const storage = multer.diskStorage({
    destination: mediaImageDir,
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});
const uploader = multer({ storage: storage });

// アップロードした画像にアクセスするためには, 下記の一行が必要.
// public直下の静的ファイルを公開する
app.use(express.static(path.join(__dirname, "public")));

// ルート
app.get('/', (req, res) => {
    // res.send('Hello World!');

    // res.send(
    //     '<p><a href="/dice/6">6面体のサイコロ</a><br/>' +
    //     '<a href="/dice/12">12面体のサイコロ</a></p>'
    // );

    res.send(
        '<p><a href="/dice/6">6面体のサイコロ</a><br/>' +
        '<a href="/dice/12">12面体のサイコロ</a></p>' +
        `<hr>` +
        `<form method="POST" action="http://${ADDR}:${PORT}${postURL}">` + 
        `<label for="memo">テスト</label></br>` +
        `<textarea id="memoArea" name="memo" rows="5" cols="5">テストだけかよ</textarea>` +
        `<br/>` +
        `<input type="submit" value="送信">` +
        `</form>` +
        `<br/>` +
        `<form method="POST" encrypt="multipart/form-data" action="http://${ADDR}:${PORT}${mediaImageURL}">` +
        `<input type="file" id="imageFile" name="imageFile" accept="image/png image/jpeg" />` + 
        `<br/>` +
        `<input type="submit" value="Upload">` +
        `</form>`
    );
});

// URLパラメータ(?key1=value1&key2=value2...)のクエリー文字列を取得する
app.get('/query', (req, res) => {
    if (!req.query.q) {
        res.send(
            '<p><a href="?q=6">6面体のサイコロ!</a><br/>' +
            '<a href="?q=12">12面体のサイコロ!</a></p>'
        );
    } else { 
        const q = parseInt(req.query.q, 10); // 10進数でnumberに変換
        res.send(`今回の値は... ${getDiceValue(q)} by query parameter.`);
    }
});

// // 6面体サイコロへアクセス
// app.get('/dice/6', (req, res) => {
//     console.log('/dice/6 にアクセスしました.');
//     res.send('今回の値は...' + getDiceValue(6));
// });

// // 12面体サイコロへアクセス
// app.get('/dice/12', (req, res) => {
//     console.log('/dice/12 にアクセスしました.');
//     res.send('今回の値は...' + getDiceValue(12));
// });

// 任意の面を持つサイコロへアクセス
app.get('/dice/:num', (req, res) => {
    console.log(`/dice/${req.params.num} にアクセスしました.`);
    res.send('今回の値は...' + getDiceValue(req.params.num));
});


function getDiceValue(num) {
    return Math.floor(Math.random() * num) + 1;
}

// POSTメソッドを受け付ける
app.post(postURL, bodyParser.urlencoded({ extended: true }), (req, res) => {
    const jsonStr = JSON.stringify(req.body);
    res.send('POSTを受信: ' + jsonStr);
    console.log('POSTメソッドを受け取りました.');
    console.log('-----');
    console.log(req.body);
});

// ファイルのアップロードを受け付ける
app.post(mediaImageURL, uploader.single('imageFile'), async (req, res) => {
    console.log('画像ファイルを受け付けました.');
    console.log('--- Headers ---');
    console.log(req.rawHeaders);
    console.log('--- Body ---');
    console.log(req.body);
    console.log('--- file ---');
    console.log(req.file);
    // console.log('--- req ---');
    // console.log(req);

    // '23/11/17 inoue shinichi 
    // [FATAL]
    // req/file がundefinedになって画像を取得できないので、終了

    // console.log('オリジナルファイル名: ', req.file.originalname);
    // console.log('送信された画像ファイルのパス: ', req.file.path);

    // MIMEタイプでファイル形式をチェック
    // let ext = '';
    // if (req.file.mimetype === 'image/png') {
    //     ext = ".png";
    // } else if (req.file.file.minetype === 'image/jpeg') {
    //     ext = ".jpeg";
    // } else {
    //     res.send("PNGまたはJPEG画像以外はUploadしません.");
    //     return;
    // }

    // TODO : ここでPNG or JPEGの形式をチェックする
    
    

    // const filename = req.file.filename + ext;
    // const dstPath = mediaImageDir + "/" + filename;
    // fs.rename(req.file.path, dstPath);

    // res.send(
    //     `ファイルを受信しました` +
    //     `<br/>`
    //     `<img src="${mediaImageDir}/${filename}" />`
    // );

    // All good
    res.sendStatus(200);
})


// WebAPIサーバ起動
app.listen(PORT, () => {
    console.log(`NodeJSサーバーを起動しました. ホスト名: http://${ADDR}:${PORT}`);
});
