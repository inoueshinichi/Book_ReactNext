/* エラーハンドリングを共通化するクロージャ */

// 成功: json 200
const wrapAPIWithReturnJson = (fn) => {
    return (req, res, next) => {
        try {
            fn(req)
                .then((data) => res.status(200).json(data))
                .catch((e) => next(e));
        } catch (e) {
            next(e);
        }
    };
};

exports.wrapAPIWithReturnJson = wrapAPIWithReturnJson;