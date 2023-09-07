
module.exports = {
  stories: [
  // '../stories/**/*.stories.mdx',
  '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'
  // '@storybook/addon-storysource',
  ],
  framework: {
    name: '@storybook/vue-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  }
};
