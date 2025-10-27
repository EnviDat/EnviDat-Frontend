import eslint from '@eslint/js';
// import eslintConfigPrettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import vuetify from 'eslint-plugin-vuetify';
import importPlugin from 'eslint-plugin-import';
// import importResolverPlugin from 'eslint-import-resolver-alias';
import globals from 'globals';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  { ignores: ['*.d.ts', '**/coverage', '**/dist'] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...vue.configs['flat/essential'],
      ...vuetify.configs['flat/recommended'],
      importPlugin.flatConfigs.recommended,
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
        },
      },
      'import/ignore': ['node_modules'],
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      // allow optionalDependencies
      'import/no-extraneous-dependencies': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/extensions': 'off',
      'import/order': 'warn',
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
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
      'class-methods-use-this': 'off',
      'lines-between-class-members': 'off',
      'vue/order-in-components': 'off',
      'vue/max-attributes-per-line': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off'
      // 'vue/multi-word-component-names': 'off'
    },
  },
  // eslintConfigPrettier
);
