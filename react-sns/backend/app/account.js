// DBアクセス機能

// Node
const path = require('node:path');
const crypto = require('node:crypto');

// 自作
const db = require('./db');
const redis = require('./redis');

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
    return (userInfo[0].token === token);
}
exports.checkToken = checkToken;


// ユーザ情報(レコード)を抽出する
async function getUser(userid) {
    console.log('userid', userid);
    let record = null;
    try {
        record = await db.getClient().any('SELECT * FROM $1:name \
            WHERE user_id=$2', [db.tablename, userid]);
    } catch (e) {
        // console.error('getUser', e);
    }
    return record;
}
exports.getUser = getUser;

// すべてのユーザ情報を抽出する
async function getUsers() {
    const records = await db.getClient().any('SELECT * FROM $1:name', [db.tablename]);
    return records;
}
exports.getUsers = getUsers;

// ユーザ情報(レコード)を登録する
async function setUser(userid, passwd, name) {
    const hash = getHash(passwd);
    const token = null;
    const friends = {};
    const date = new Date();
    await db.getClient().any('INSERT INTO $1:name \
    (user_id, name, hash, token, friends, register_date) \
    VALUES ($2,$3,$4,$5,$6,$7)',
        [db.tablename, userid, name, hash, token, friends, date]);

    return {
        userid: userid,
        name: name,
        hash: hash,
        token: token,
        friends: friends,
        date: date
    };
}
exports.setUser = setUser;

// ログインして認可トークンを取得する
async function loginUser(userid, passwd) {
    const hash = getHash(passwd);
    const token = getAuthToken(userid);
    console.log(`userid: ${userid}, hash: ${hash}, token: ${token}`);

    let dbHash = null;
    try {
        // ログインユーザのハッシュを比較する
        dbHash = await db.getClient().any('SELECT hash \
                                            FROM $1:name \
                                            WHERE user_id = $2',
            [db.tablename, userid]);
        dbHash = dbHash[0].hash; // [{ hash: "~"}]
    } catch (e) {
        console.error(e);
    }

    console.log('IN hash: ', hash);
    console.log('DB hash: ', dbHash);
    if (hash === dbHash) {
        // 認証トークンを更新
        await db.getClient().any('UPDATE $1:name \
                                    SET token = $2 \
                                    WHERE user_id = $3',
            [db.tablename, token, userid]);
    }

    // 更新したDBの認証トークンを取得(念のため)
    userInfo = await getUser(userid);
    console.log('userInfo', userInfo);
    return userInfo[0].token;
}
exports.loginUser = loginUser;


// タイムラインの取得 from Redis
const getTimeline = async (userid) => {
    const stream = redis.getClient().scanStream({
        match: userid,
        count: 2
    });

    const timelineList = [];
    // AsyncIterator
    for await (const resultKeys of stream) {
        for (const key of resultKeys) {
            const value = await redis.getClient().get(key); // string
            const timeline = JSON.parse(value);
            timelineList.push(...timeline);
        }
    }
    return timelineList;
};
exports.getTimeline = getTimeline;

// タイムラインに追加 to Redis
const addTimeline = async (userid, comment) => {
    let timelineList = await getTimeline(userid);
    const id = timelineList.length + 1;
    timelineList = [
        ...timelineList,
        { id: id, timestamp: new Date(), comment: comment }
    ];

    redis.getClient().set(userid, JSON.stringify(timelineList));
    return comment;
};
exports.addTimeline = addTimeline;

// 友人情報を追加する
async function addUserFriend(userid, friendid) {
    let retVal = false;
    // 友人情報を追加(更新する)
    try {
        // 検索(更新前)
        let friendsColumn = await db.getClient().any('SELECT friends \
                                                        FROM $1:name \
                                                        WHERE user_id = $2',
            [db.tablename, userid]);

        console.log('===== 更新前 =====');
        console.log(`friendsColumn: `, friendsColumn);
        let obj = friendsColumn[0];
        console.log('obj.friends: ', obj.friends);
        console.log('Object.keys(obj.friends): ', Object.keys(obj.friends));

        if (!(friendid in Object.keys(obj.friends))) {
            // 更新
            await db.getClient().any('UPDATE $1:name \
                                SET friends = friends::jsonb || json_build_object($2, true)::jsonb \
                                WHERE user_id = $3',
                [db.tablename, friendid, userid]);
            retVal = true;

        }

        // 検索(更新後)
        friendsColumn = await db.getClient().any('SELECT friends \
                                                FROM $1:name \
                                                WHERE user_id = $2',
            [db.tablename, userid]);

        console.log('===== 更新後 =====');
        console.log(`friendsColumn: `, friendsColumn);
        obj = friendsColumn[0];
        console.log('obj.friends: ', obj.friends);
    } catch (e) {
        console.error(e);
    }
    return retVal;
}
exports.addUserFriend = addUserFriend;


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