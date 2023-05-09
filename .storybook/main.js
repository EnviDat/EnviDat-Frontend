const path = require('path');
const { mergeConfig } = require('vite');

// const vue = require('@vitejs/plugin-vue2').default;
const { VuetifyResolver } = require('unplugin-vue-components/resolvers');
const Components = require('unplugin-vue-components/vite');
const ViteRequireContext = require('@originjs/vite-plugin-require-context').default;

// const eslint = require('vite-plugin-eslint').default;
const Unfonts = require('unplugin-fonts/vite').default;

const version = process.env.npm_package_version;

module.exports = {
  stories: [
    // '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    // '@storybook/addon-storysource',
  ],
  framework: "@storybook/vue",
  core: { builder: "@storybook/builder-vite" },
  async viteFinal(config, { configType }) {
    // return the customized config
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    return mergeConfig(config, {
      plugins: [
        // vue(),
        ViteRequireContext(),
        Components({
           resolvers: [
             // Vuetify
             VuetifyResolver(),
           ],
        }),
        // eslint(),
        Unfonts({
          google: {
            families: [
              'Baskervville',
              {
                name: 'Raleway',
                styles: 'wght@400;500;700',
              },
            ],
          },
        }),
      ],
/*
      // customize the Vite config here
      test: /\.s(a|c)ss$/,
      // Use Sass loader for vuetify components
      use: ['style-loader', 'css-loader', 'sass-loader'],
      base: './',
      // include: path.resolve(__dirname, '../'),
      // resolve: (await import('../vite.config.js')).default.resolve,
*/
      resolve: {
        alias: [
          { find: '@', replacement: path.resolve(__dirname, '../src') },
          { find: '~', replacement: path.resolve(__dirname) },
          // resolve vue for vite (based on rollup) https://v2.vuejs.org/v2/guide/installation.html#Explanation-of-Different-Builds
          { find: 'vue', replacement: 'vue/dist/vue.esm.js' },
        ],
      },
      build: {
        minify: false,
        sourcemap: false,
        define: {
          'import.meta.env.VITE_VERSION': JSON.stringify(version),
        },
      },
    });
  },
};
