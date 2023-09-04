// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021,
  },
  env: {
    es2021: true,
    'vitest-globals/env': true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
    'plugin:import/recommended',
    'prettier',
    'plugin:storybook/recommended',
    'plugin:vitest-globals/recommended',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
        ],
      },
    },
  },
  // // required to lint *.vue files
  plugins: [
    'vuetify',
//    'simple-import-sort',
  ],
  'ignorePatterns': ['particles.js'],
  // add your custom rules here
  rules: {
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
/*
    'import/extensions': ['error', // warning
      'always', {
        'js': 'never',
        'vue': 'never',
      },
    ],
*/
    'import/no-unresolved': 'off',
    // allow optionalDependencies
    'import/no-extraneous-dependencies': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    'no-unused-vars': 'warn',
    'max-len': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',
    'linebreak-style': 'off',
    'padded-blocks': 'off',
    'indent': 'off',
    'no-trailing-spaces': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'jsx-quotes': ['error', 'prefer-single'],
    'quotes': ['error', 'single', {
      avoidEscape: true,
    }],
    'operator-linebreak': ['off', 'before'],
    // enforce CLRF linebreaks = 'linebreak-style' : ["error", "unix"]
    // windows linebreaks when not in production environment
    // "linebreak-style": ["error", process.env.NODE_ENV === 'prod' ? "unix" : "windows"]
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    // 'vuetify/no-legacy-grid': 'error',
    'implicit-arrow-linebreak': 0,
    'no-restricted-syntax': 0,
    'vue/no-v-text-v-html-on-component': 'off',
/*
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
*/
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
