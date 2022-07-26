import path from 'path';
import { mergeConfig } from 'vite';

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
  core: { builder: "@storybook/builder-vite" },
  async viteFinal(config, { configType }) {
    // return the customized config
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    return mergeConfig(config, {
      // customize the Vite config here
      test: /\.s(a|c)ss$/,
      // Use Sass loader for vuetify components
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
          cesium: path.resolve(__dirname, '../node_modules/cesium/Source'),
        },
      },
    });
  },
};
