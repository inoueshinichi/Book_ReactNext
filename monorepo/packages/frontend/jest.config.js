// jestの設定

module.exports = {
    roots: [
        "<rootDir>/dst/app"
    ],
    // Backend
    // testEnvironment: 'node',
    // Frontend
    testEnvironment: 'jsdom',
    collectCoverage: true,
    testMatch: [
        "**/__tests__/**/*.+(js|jsx)",
        "**/?(*.)+(spec|test).+(js|jsx)"
    ],
    // transform: {
    //     "^.+\\.(js|jsx)$": "js-jest"
    // },
};

