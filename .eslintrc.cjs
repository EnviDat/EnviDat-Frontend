// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  env: {
    es2022: true,
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
        map: [['@', './src']],
      },
    },
  },

  plugins: ['vuetify'],
  ignorePatterns: ['particles.js'],
  rules: {
    'import/no-unresolved': 'off',
    // allow optionalDependencies
    'import/no-extraneous-dependencies': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'max-len': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'no-param-reassign': 'off',
    'linebreak-style': 'off',
    'padded-blocks': 'off',
    'implicit-arrow-linebreak': 0,
    'no-restricted-syntax': 0,
    'comma-dangle': ['error', 'always-multiline'],
    'jsx-quotes': ['error', 'prefer-single'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'operator-linebreak': ['off', 'before'],
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vue/no-v-text-v-html-on-component': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
};
