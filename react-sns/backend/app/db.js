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
let makeDB = pgp({
    // Initialization Options
});

// PostgreDB
let pg = null;
exports.pg = pg;

// PostgreDB接続
const connectPostgre = () => {
    if (!pg) {
        pg = makeDB(config.postgreConfig);
    }
    return pg;
};
exports.connectPostgre = connectPostgre;

// PostgreDBの初期化
const initPostgreDB = async () => {
    if (!pg) {
        return;
    }

    // postgresデータベースに接続中
    const dbname = 'sns';
    const tablename = 'Account';

    try {
        // SNS DBを作成
        await pg.any('CREATE DATABASE $1:name', [dbname]);
        console.log('[Success] create db: ', dbname);
    } catch (e) {
        // console.log(e);
        console.log('DB作成はスキップ');
    }

    // PostgreSQL DB との接続を一旦切断
    // pg.$pool.end(); or connectDB.end();

    // 作成した SNS DBに再接続
    config.postgreConfig.database = dbname; // sns
    pg = makeDB(config.postgreConfig);

    try {
        // Accountテーブル作成
        await pg.any("CREATE TABLE $1:name (\
            user_id INTEGER NOT NULL, \
            name VARCHAR(256) NOT NULL, \
            hash INTEGER NOT NULL, \
            token INTEGER, \
            friends INTEGER, \
            register_date DATE, \
            PRIMARY KEY (user_id)\
            )", [tablename]);
        console.log('[Success] create table: ', tablename);
    } catch (e) {
        // console.log(e);
        console.log('Table作成はスキップ');
    }

    try {
        // Insert
        await pg.any("INSERT INTO $1:name \
            (user_id, name, hash, token, friends, register_date) \
            VALUES (\
                20240110,\
                'inoue',\
                1234,\
                5678,\
                100,\
                '2024-01-10'\
                )", [tablename]);
    } catch (e) {
        console.error(e);
    }

    // Select
    const records = await pg.any('SELECT * FROM $1:name', [tablename]);
    console.log("records", records);

    console.log('Finish initPostgreDB');
};
exports.initPostgreDB = initPostgreDB;
