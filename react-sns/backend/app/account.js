// DBアクセス機能

// Node
const path = require('node:path');
const crypto = require('node:crypto');

// 自作
const db = require('./db');

// ハッシュ値(sha512)を計算
function getHash(passwd) {
    const salt = '::EVuCM0QwfI48Krpr';
    const hashsum = crypto.createHash('sha512');
    hashsum.update(passwd + salt);
    return hashsum.digest('hex');
}
exports.getHash = getHash;

// 認証用のアクセストークンを作成
function getAuthToken(userid) {
    // ログイン時のアクセス時間を混ぜることで, ログイン毎にセッション用トークンを創る
    const time = Date.now();
    return getHash(`${userid}:${time}`);
}
exports.getAuthToken = getAuthToken;

// 認証トークンの検証
async function checkToken(userid, token) {
    const userInfo = await getUser(userid);
    return (userInfo['token'] === token);
}
exports.checkToken = checkToken;

// ユーザ情報(レコード)を返す
async function getUser(userid) {
    const record = await pg.any('SELECT * FROM Account WHERE user_id=$1:name', [userid]);
    return record;
}
exports.getUser = getUser;

async function getUsers(userid, token) {
    // 認証
    const isValid = checkToken(userid, token);
    if (!isValid) {
       return new Error("認証に失敗");
    }

    // Accountテーブル全体を取得
    const records = await pg.any('SELECT * FROM Account', []);
    return records;
}
exports.getUsers = getUsers;

async function setUser(userid, passwd) {
    
}
exports.setUser = setUser;

async function loginUser(userid, passwd) {
    const hash = getHash(passwd);
    const token = getAuthToken(userid);
    const userInfo = await getUser(userid);
    if (userInfo == null) {
        return new Error('ユーザ登録がされていません');
    }
    return userInfo;
}
exports.loginUser = loginUser;


// async function addUserFriend(userid, friendid) {

// }
// exports.addUserFriend = addUserFriend;

// // ユーザ情報を更新
// async function updateUser() {

// }
// exports.updateUser = updateUser;

// // 友達のタイムラインを取得する
// async function getFriendsTimeline(userid, token, num) {
//     const isValid = checkToken(userid, token);
//     if (!isValid) {
//         return new Error("認証に失敗");
//     }

//     // 友人の一覧を取得
//     const friends = [];
//     const userInfo = await getUser(userid);
//     for (const friend in userInfo['friends']) {
//         friends.push(friend);
//     }
//     friends.push(userid); // 自分

//     // 友人のタイムラインを最大num件取得

// }
// exports.getFriendsTimeline = getFriendsTimeline;