module.exports = {
  extends: ['airbnb-base', 'prettier', 'prettier', 'prettier', 'prettier', 'prettier'],
  rules: {
    'linebreak-style': 0,
    'no-param-reassign': 0,
    'no-use-before-define': [
      'warn',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
  },
  env: {
    browser: true,
    node: true,
    jasmine: true,
  },
  globals: {
    gapi: true,
    $: true,
  },
};
