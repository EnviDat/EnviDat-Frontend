const path = require('path');

module.exports = {
  "stories": [
    "../stories/**/*.stories.@(js)"
  ],
//  "../stories/**/*.stories.mdx",
//  "../stories/**/*.stories.@(js|jsx|ts|tsx)"
//  "addons": [
//    "@storybook/addon-links",
//    "@storybook/addon-essentials",
//    "@storybook/addon-storysource"
//  ],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Use Sass loader for vuetify components
    config.module.rules.push({
      test: /\.s(a|c)ss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // config.module.rules.push({
    //   test: /\.(png|jpg)$/,
    //   use: ['file-loader'],
    //   include: path.resolve(__dirname, '../'),
    // });

    config.module.rules.push({
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          vue: 'vue/dist/vue.js',
          'vue$': 'vue/dist/vue.esm.js',
          cesium: path.resolve(__dirname, '../node_modules/cesium/Source'),
        },
      },
    });

    // Return the altered config
    return config;
  },
};
