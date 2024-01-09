// DB
const config = require('./config');

/* ----------- Redis Settings ----------- */
const Redis = require("ioredis");

// RedisDB
let redis = null;
exports.redis = redis;

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
    return;
};
exports.initRedisDB = initRedisDB;

/* ---------- Postgre Settings ---------- */
const pgp = require('pg-promise');

// PostgreDB
let pg = null;
exports.pg = pg;

// PostgreDB接続
const connectPostgre = () => {
    if (!pg) {
        const connect = pgp({
            // Initialization Options
        });

        pg = connect(config.postgreConfig);
    }
    return pg;
};
exports.connectPostgre = connectPostgre;

// PostgreDBの初期化
const initPostgreDB = async () => {
    if (!pg) {
        return;
    }

    const dbname = 'sns';
    const tablename = 'Account';

    try {
        // SNS DBを作成
        await pg.any('CREATE DATABASE $1:name', [dbname]);

        // PostgreDBとの接続を一旦切断
        pg.$pool.end();

        // 作成した SNS DBに再接続
        config.postgreConfig.database = dbname; // sns
        const connect = pgp({
            // Initialization Options
        });
        pg = connect(config.postgreConfig);

        try {
            // Accountテーブル作成
            await pg.any("CREATE TABLE $1:name (\
            user_id INTEGER NOT NULL, \
            name VARCHAR(256) NOT NULL, \
            hash INTEGER NOT NULL, \
            token INTEGER, \
            friends INTEGER, \
            register_data DATE, \
            PRIMARY KEY (user_id)\
            )", [tablename]);
        } catch (e) {
            console.log(`${tablename}は作成ずみです`);
        }
    } catch (e) {
        // Accountテーブル作成
        await pg.any("CREATE TABLE $1:name (\
            user_id INTEGER NOT NULL, \
            name VARCHAR(256) NOT NULL, \
            hash INTEGER NOT NULL, \
            token INTEGER, \
            friends INTEGER, \
            register_data DATE, \
            PRIMARY KEY (user_id)\
            )", [tablename]);
    }

    const records = await pg.any('SELECT * FROM $1:name', [tablename]);
    console.log("records", records);

    console.log('Finish initPostgreDB');
};
exports.initPostgreDB = initPostgreDB;
