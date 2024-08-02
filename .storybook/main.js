import { mergeConfig } from 'vite';

module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-storysource', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/vue-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },

  // reference
  // https://stackoverflow.com/questions/76297669/nx-16-cant-configure-a-proxy-in-storybook-vite-and-react-library
  // https://storybook.js.org/docs/builders/vite

  async viteFinal(config) {
    return mergeConfig(config, {
      optimizeDeps: {
        include: ['storybook-dark-mode'],
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
