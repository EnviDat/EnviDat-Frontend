
export default {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook'
  ],

  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },

  docs: {}
};
