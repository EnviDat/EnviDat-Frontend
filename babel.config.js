/**
 * @summary config of babel
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2019-10-23 16:58:05
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      // '@babel/preset-env', { targets: { node: 'current' } },
    ],
  ],
  env: {
    test: {
      plugins: [
        'require-context-hook',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },
  },  
};
