module.exports = {
  root: true,
  extends: [
    'airbnb-base',
  ],
  env: {
    browser: true,
    mocha: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    // allow reassigning param
    'no-param-reassign': [2, { props: false }],
    'linebreak-style': ['error', (process.platform === 'win32' ? 'windows' : 'unix')],
    'import/extensions': ['error', {
      js: 'always',
    }],
    //
    'mocha/no-skipped-tests': 'error',
    'mocha/no-exclusive-tests': 'error',
  },
  plugins: [
    'mocha',
  ],
  globals: {
    __testdir: true,
  },
};
