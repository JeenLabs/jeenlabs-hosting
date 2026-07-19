module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-empty': [1, 'never'],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
