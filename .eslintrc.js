// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 10,
  },

  // env: {
  //   browser: true,
  // },
  extends: [
    '@vue/airbnb',
    'plugin:vue/essential',
    'prettier/vue',
  ],

  // // required to lint *.vue files
  plugins: [
    // 'html',
    'vuetify',
  ],
  // // check if imports actually resolve
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },

  // },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': [
      1, // warning
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'import/prefer-default-export': 0,
    'no-plusplus': 0,
    'no-unused-vars': 1,
    'max-len': 0,
    'prefer-destructuring': 0,
    'no-param-reassign': 0,
    'linebreak-style': 0,
    'padded-blocks': 0,
    'indent': 0,
    'no-trailing-spaces': 0,
    'comma-dangle': [2, 'always-multiline'],
    'jsx-quotes': [2, 'prefer-single'],
    'quotes': [2, 'single', { avoidEscape: true }],
    // enforce CLRF linebreaks = 'linebreak-style' : ["error", "unix"]
    // windows linebreaks when not in production environment
    // "linebreak-style": ["error", process.env.NODE_ENV === 'prod' ? "unix" : "windows"]
    'vuetify/no-deprecated-classes': 2,
    'vuetify/grid-unknown-attributes': 2,
    'vuetify/no-legacy-grid': 2,
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
