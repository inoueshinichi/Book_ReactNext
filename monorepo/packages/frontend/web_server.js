// 静的ファイル(*.html, *.js, *.cssなど)の配信サーバー
// http-proxy-middlewareでCORS対策する

// ES Module
// import { createProxyMiddleware } from 'http-proxy-middleware';
// import path from 'node:path';
// import { fileURLToPath } from 'url';
// import express from 'express';
// import multer from 'multer';

// CommonJS
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('node:path');
const express = require('express');
const multer = require('multer');
const { expressConfig } = require('./express.config');



// ES Modules 環境下でも__filename, __dirnameを使用する方法
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
// /api URLに対してProxyを設定してhttp://localhost:8000に転送
app.use('/api', 
        createProxyMiddleware({
             target: 'http://localhost:8000' 
        })
);

// 公開フォルダの設定
app.use(express.static(path.join(__dirname, 'public')));

// staticフォルダの配置
app.use('/static', express.static(path.join(__dirname, 'public', 'static')));

app.get('/manifest.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// app.get('/', (req, res, next) => {
app.get('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 包括的エラーハンドリング
app.use((err, req, res, next) => {

    // 例外キャッチできなかった場合の最終手段
    res.status(500).send('Internal Server Error');
    console.error('[Internal Server Error]', err);
});

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

// bodyのエンコード方式(3つ) 
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


app.listen(expressConfig.port, () => {
    console.log('[START] web server');
});