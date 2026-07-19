module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'refactor',
        'docs',
        'chore',
        'build',
        'deps',
        'ci',
        'test',
        'perf',
        'style',
        'security',
        'revert',
      ],
    ],
    'scope-empty': [1, 'never'],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
