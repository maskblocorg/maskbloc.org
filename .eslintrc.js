/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ["_site/**"],
  root: true,
  browser: true
};
