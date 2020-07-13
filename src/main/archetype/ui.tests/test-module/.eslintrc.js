module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:wdio/recommended'
    ],
    env: {
        commonjs: true,
        es2017: true,
        node: true,
        mocha: true
    },
    parserOptions: {
        ecmaVersion: 9
    },
    rules: {
        'semi': ['error'],
        'semi-spacing': ['error', { before: false, after: true }],
        'semi-style': ['error', 'last'],
        'quotes': ['error', 'single'],
        'indent': ['error', 4],
        'no-trailing-spaces': ['error']
    },
    'plugins': [
        'wdio'
    ],
};
