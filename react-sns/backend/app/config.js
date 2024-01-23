
// Postgre
postgreConfig = {
    host: "localhost",
    port: 5432,
    database: "postgres", // デフォルト
    user: "postgres", // デフォルト
    password: "1800", // DB パスワード
    max: 30,
    // connectionString: "postgres://postgres:1800@localhost:5432/postgres"
};

exports.postgreConfig = postgreConfig;

/*
                         Table "public.account"
    Column     |          Type          | Collation | Nullable | Default 
---------------+------------------------+-----------+----------+---------
 user_id       | integer                |           | not null | 
 name          | character varying(256) |           | not null | 
 hash          | integer                |           | not null | 
 token         | integer                |           |          | 
 friends       | integer(or JSON)       |           |          | 
 register_data | date                   |           | not null | 
Indexes:
    "account_pkey" PRIMARY KEY, btree (user_id)
*/

// Redis
redisConfig = {
    host: "localhost",
    port: 6379,
    enableOfflineQueue: false
};

exports.redisConfig = redisConfig;

// Express
expressConfig = {
    host: "localhost",
    port: 3300
};

exports.expressConfig = expressConfig;


