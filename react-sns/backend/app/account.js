// DBアクセス機能

// Node
const path = require('node:path');
const crypto = require('node:crypto');


// ハッシュ値(sha512)を計算
function getHash(passwd) {
    const salt = '::EVuCM0QwfI48Krpr';
    const hashsum = crypto.createHash('sha512');
    hashsum.update(passwd + salt);
    return hashsum.digest('hex');
}

// 認証用のアクセストークンを作成
function getAuthToken(userid) {
    // ログイン時のアクセス時間を混ぜることで, ログイン毎にセッション用トークンを創る
    const time = Date.now();
    return getHash(`${userid}:${time}`);
}

// 認証トークンの検証
async function checkToken(userid, token) {
    const userInfo = await getUser(userid);
    return (userInfo['token'] === token);
}

// ユーザ情報(レコード)を返す
async function getUser(userid) {
    
}

async function getUsers() {

}

async function setUser(userid, passwd) {
    
}

async function loginUser(userid, passwd) {
    const hash = getHash(passwd);
    const token = getAuthToken(userid);
    const userInfo = await getUser(userid);

}



async function addUserFriend(userid, friendid) {

}

// ユーザ情報を更新
async function updateUser() {

}

// 友達のタイムラインを取得する
async function getFriendsTimeline(userid, token, num) {
    const isValid = checkToken(userid, token);
    if (!isValid) {
        return new Error("認証に失敗");
    }

    // 友人の一覧を取得
    const friends = [];
    const userInfo = await getUser(userid);
    for (const friend in userInfo['friends']) {
        friends.push(friend);
    }
    friends.push(userid); // 自分

    // 友人のタイムラインを最大num件取得

}