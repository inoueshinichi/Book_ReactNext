// 独自例外クラス

/* エラーに合わせた独自例外クラス */
class BadRequest extends Error {
    constructor(message, req) {
        super('Bad Request');
        this.status = 400;
        this.req = req;
        this.message = message;
    }
};

class NotFoundHTML extends Error {
    constructor(message) {
        super('NotFound');
        this.status = 404;
    }
};

