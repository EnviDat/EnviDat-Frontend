import { mergeConfig } from 'vite';

export default {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  core: {
    disableTelemetry: true,
  },
  build: {
    test: {
      disableSourcemaps: false,
    },
  },
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y'
  ],

  framework: {
    name: '@storybook/vue3-vite',
  },

  // reference
  // https://stackoverflow.com/questions/76297669/nx-16-cant-configure-a-proxy-in-storybook-vite-and-react-library
  // https://storybook.js.org/docs/builders/vite

  async viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: {
      },
      server: {
        proxy: {
          '/api': {
            target: 'https://statistics.wsl.ch',
            changeOrigin: true,
            secure: false,
            rewrite: path => path.replace(/^\/api/, ''),
          },
        },
      },
    });
  },
};
