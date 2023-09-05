import vuetify from '../src/plugins/vuetify';
import { envidatViewportParameters } from '~/stories/js/envidatViewports';
import { setup } from '@storybook/vue3';
import { withVuetifyTheme } from './withVuetifyTheme.decorator';

setup((app) => {
  // Registers your app's plugins into Storybook
  app.use(vuetify)
});

// read more: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy
export const parameters = {
  options: {
    storySort: {
      method: 'alphabetical',
//      order: [],
//      locales: '',
    },
  },
  ...envidatViewportParameters,
};

// read more: https://storybook.js.org/recipes/vuetify#register-vuetify-in-storybook
// decorator for vuetify is necessary
export const decorators = [withVuetifyTheme];

