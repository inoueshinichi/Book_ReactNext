// CORS

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

exports.allowCORS = allowCORS;