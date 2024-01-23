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
    const commentList = [
        { id: 1, timestamp: new Date(), comment: "おはようございます" },
        { id: 2, timestamp: new Date(), comment: "こんにちは" },
        { id: 3, timestamp: new Date(), comment: "こんばんは" },
        /* URLエンコードされた`ありがとうございます` */
        { id: 4, timestamp: new Date(), comment: "ã\x81\x82ã\x82\x8Aã\x81\x8Cã\x81¨ã\x81\x86ã\x81\x94ã\x81\x96ã\x81\x84ã\x81¾ã\x81\x99"}, 
        { id: 5, timestamp: new Date(), comment: "ありがとうございます" },
    ];

    const userid = '20240120'; 

    await Promise.all([
        redis.set(userid, JSON.stringify(commentList)),
    ]);

    const value = await redis.get('20240120');
    console.log(`[Check Redis] key:${userid}, value: ${value}`);
};
exports.initRedisDB = initRedisDB;

