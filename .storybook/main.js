
module.exports = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/vue-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  }
};
