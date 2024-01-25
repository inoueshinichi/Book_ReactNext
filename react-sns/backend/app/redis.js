// Redis in memory cache
const config = require('./config');

/* ----------- Redis Settings ----------- */
const Redis = require("ioredis");

// RedisDB
let redis = null;

const getClient = () => {
    return redis;
};
exports.getClient = getClient;

// RedisDB接続
const connectRedis = () => {
    if (!redis) {
        redis = new Redis(config.redisConfig);
    }
    return redis;
};
exports.connectRedis = connectRedis;

// RedisDBの初期化
const initRedisDB = async () => {
    
    let userid = "";
    let commentList = [];
    let value = null;

    // ユーザー1
    userid = '20240110';
    commentList = [
        { id: 1, timestamp: new Date(), comment: "Good Morning" },
        { id: 2, timestamp: new Date(), comment: "Good Noon" },
        { id: 3, timestamp: new Date(), comment: "Good Afternoon" },
        { id: 4, timestamp: new Date(), comment: "Good Evening" },
        { id: 5, timestamp: new Date(), comment: "Good Nignt" },
    ];
    await Promise.all([
        redis.set(userid, JSON.stringify(commentList)),
    ]);
    value = await redis.get(userid);
    console.log(`[Check Redis] key:${userid}, value: ${value}`);


    // ユーザー2
    userid = '20240120'; 
    commentList = [
        { id: 1, timestamp: new Date(), comment: "おはようございます" },
        { id: 2, timestamp: new Date(), comment: "こんにちは" },
        { id: 3, timestamp: new Date(), comment: "こんばんは" },
        /* URLエンコードされた`ありがとうございます` */
        { id: 4, timestamp: new Date(), comment: "ã\x81\x82ã\x82\x8Aã\x81\x8Cã\x81¨ã\x81\x86ã\x81\x94ã\x81\x96ã\x81\x84ã\x81¾ã\x81\x99"}, 
        { id: 5, timestamp: new Date(), comment: "ありがとうございます" },
    ];
    await Promise.all([
        redis.set(userid, JSON.stringify(commentList)),
    ]);
    value = await redis.get(userid);
    console.log(`[Check Redis] key:${userid}, value: ${value}`);

    
    // ユーザー3
    userid = '20240124';
    commentList = [
        { id: 1, timestamp: new Date(), comment: "TOYOTA" },
        { id: 2, timestamp: new Date(), comment: "HONDA" },
        { id: 3, timestamp: new Date(), comment: "NISSAN" },
        { id: 4, timestamp: new Date(), comment: "SUZUKI" },
        { id: 5, timestamp: new Date(), comment: "DAIHATSU" },
        { id: 6, timestamp: new Date(), comment: "MAZDA" },
        { id: 7, timestamp: new Date(), comment: "SUBARU" },
        { id: 8, timestamp: new Date(), comment: "MITSUBISHI" },
    ];
    await Promise.all([
        redis.set(userid, JSON.stringify(commentList)),
    ]);
    value = await redis.get(userid);
    console.log(`[Check Redis] key:${userid}, value: ${value}`);

    // ユーザー4
    userid = '20240125';
    commentList = [
        { id: 1, timestamp: new Date(), comment: "ほのお" },
        { id: 2, timestamp: new Date(), comment: "みず" },
        { id: 3, timestamp: new Date(), comment: "くさ" },
        { id: 4, timestamp: new Date(), comment: "じめん" },
        { id: 5, timestamp: new Date(), comment: "ゴースト" },
        { id: 6, timestamp: new Date(), comment: "いわ" },
        { id: 7, timestamp: new Date(), comment: "ノーマル" },
        { id: 8, timestamp: new Date(), comment: "かくとう" },
        { id: 9, timestamp: new Date(), comment: "でんき" },
        { id: 10, timestamp: new Date(), comment: "むし" },
        { id: 11, timestamp: new Date(), comment: "どく" },
        { id: 12, timestamp: new Date(), comment: "エスパー" },
        { id: 13, timestamp: new Date(), comment: "ひこう" },
        { id: 14, timestamp: new Date(), comment: "こおり" },
        { id: 15, timestamp: new Date(), comment: "ドラゴン" },
        { id: 16, timestamp: new Date(), comment: "はがね" },
        { id: 17, timestamp: new Date(), comment: "あく" },
        { id: 18, timestamp: new Date(), comment: "フェアリー" },
        { id: 19, timestamp: new Date(), comment: "ステラ" },
        { id: 20, timestamp: new Date(), comment: "*" },
    ];
    await Promise.all([
        redis.set(userid, JSON.stringify(commentList)),
    ]);
    value = await redis.get(userid);
    console.log(`[Check Redis] key:${userid}, value: ${value}`);

};
exports.initRedisDB = initRedisDB;

