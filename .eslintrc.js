// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2021
  },
  env: { es2021: true },
  extends: [
    'airbnb-base',
    'plugin:vue/essential',
    'plugin:import/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['cesium', './node_modules/cesium/Source'],
        ],
      },
    },
  },
  // // required to lint *.vue files
  plugins: ['vuetify', 'simple-import-sort', 'import'],
  "ignorePatterns": ["particles.js"],
  // add your custom rules here
  rules: {
    'import/extensions': [0, { 'js': "always" }],
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
      avoidEscape: true
    }],
    'operator-linebreak': ['off', 'before'],
    // enforce CLRF linebreaks = 'linebreak-style' : ["error", "unix"]
    // windows linebreaks when not in production environment
    // "linebreak-style": ["error", process.env.NODE_ENV === 'prod' ? "unix" : "windows"]
    'vuetify/no-deprecated-classes': 'error',
    'vuetify/grid-unknown-attributes': 'error',
    'vuetify/no-legacy-grid': 'error',
    'implicit-arrow-linebreak': 0,
    'no-restricted-syntax': 0,
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
  },
  overrides: [{
    files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
    env: {
      jest: true,
    },
  }]
};
