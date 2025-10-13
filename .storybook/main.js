import { mergeConfig } from 'vite';

const allStories = ['../stories/**/*.stories.@(js|jsx|ts|tsx)'];

const storiesToLoad = [
  // '../stories/**/*.stories.@(js|jsx|ts|tsx)', // all stories
  '../stories/baseElements/**/*.stories.@(js|jsx|ts|tsx)', // base components
  '../stories/workflow/**/*.stories.@(js|jsx|ts|tsx)', // workflow components
  // '../stories/dataset/**/*.stories.@(js|jsx|ts|tsx)', // create & edit dataset
  // '../stories/search/**/*.stories.@(js|jsx|ts|tsx)', // search components
  // '../stories/navigation/**/*.stories.@(js|jsx|ts|tsx)', // navigation components
  // '../stories/user/**/*.stories.@(js|jsx|ts|tsx)', // navigation components
  // '../stories/projects/**/*.stories.@(js|jsx|ts|tsx)', // project page components
  // '../stories/blog/**/*.stories.@(js|jsx|ts|tsx)', // blog page components
];

const prod = import.meta.env?.MODE === 'production';

export default {
  stories: prod ? allStories : storiesToLoad,
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

  managerHead: (head) => `
    ${head}
    <meta name="robots" content="noindex" />
  `,
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
