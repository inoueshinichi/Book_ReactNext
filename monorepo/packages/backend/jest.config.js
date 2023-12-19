// jestの設定

module.exports = {
    "roots": [
        "<rootDir>"
    ],
    "testMatch": [
        "**/__tests__/**/*.+(js|jsx)",
        "**/?(*.)+(spec|test).+(js|jsx)"
    ],
    "transform": {
        "^.+\\.(js|jsx)$": "js-jest"
    },
};

