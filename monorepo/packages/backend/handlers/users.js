const redis = require("../lib/redis");

const getUser = async (req) => {
    const key = `users:${req.params.id}`;
    // Promise<Reject>を返すとそのまま, throw Errorを上位にロールバックする
    const val = await redis.getClient().get(key);
    const user = JSON.parse(val);
    return user;
};

exports.getUser = getUser;

const getUsers = async (req) => {
    const stream = redis.getClient().scanStream({
        match: 'users:*',
        count: 2
    });

    const users = [];
    // AsyncIterator
    for await (const resultKeys of stream) {
        for (const key of resultKeys) {
            const value = await redis.getClient().get(key);
            const user = JSON.parse(value);
            users.push(user);
        }
    }

    return { users: users };
};

exports.getUsers = getUsers;

