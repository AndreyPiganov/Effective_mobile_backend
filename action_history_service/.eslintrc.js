module.exports = {
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'warn',
        semi: ['error', 'always'],
        eqeqeq: 'error',
        'prettier/prettier': 'error'
    }
};
