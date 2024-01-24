// Postgre SQL DB

const config = require('./config');

/* ---------- Postgre Settings ---------- */
const pgp = require('pg-promise');
let makeDB = pgp({
    // Initialization Options
});

// PostgreDB
let pg = null;
const dbname = 'sns';
exports.dbname = dbname;
const tablename = 'Account';
exports.tablename = tablename;

// PostgreDBクライアント
const getClient = () => {
    return pg;
};
exports.getClient = getClient;

// PostgreDB接続
const connectPostgre = () => {
    if (!pg) {
        // 一旦, postgresユーザ(role)でpostgresデータベースに接続する
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
    
    // 新しく創るSNSデータベースとAccountテーブル
    try {
        // SNS DBを作成
        console.log(`Creating Database ${dbname}`);
        await pg.any('CREATE DATABASE $1:name OWNER $2:name', [dbname, config.postgreConfig['user']]);
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
        console.log(`Creating Table ${tablename}`);
        await pg.any("CREATE TABLE $1:name (\
            user_id INTEGER NOT NULL, \
            name VARCHAR(256) NOT NULL, \
            hash VARCHAR(256) NOT NULL, \
            token VARCHAR(256), \
            friends JSONB, \
            register_date DATE NOT NULL, \
            PRIMARY KEY (user_id)\
            )", [tablename]);
        console.log('[Success] create table: ', tablename);
    } catch (e) {
        // console.log(e);
        console.log('Table作成はスキップ');
    }

    try {
        // Insert
        const friends = {};
        await pg.any("INSERT INTO $1:name \
            (user_id, name, hash, token, friends, register_date) \
            VALUES (\
                20240110,\
                'inoue',\
                '1234',\
                '5678',\
                 $2:json,\
                '2024-01-10'\
                )", [tablename, friends]);
    } catch (e) {
        console.error(e);
    }

    // Select
    const records = await pg.any('SELECT * FROM $1:name', [tablename]);
    console.log("Account records", records);

    console.log('Finish initPostgreDB');
};
exports.initPostgreDB = initPostgreDB;
