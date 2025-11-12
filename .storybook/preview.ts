import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import config from '@/plugins/vuetifyConfig.js';

import { envidatViewportParameters } from '~/stories/js/envidatViewports';
import { setup } from '@storybook/vue3-vite';
import { withVuetifyTheme } from './withVuetifyTheme.decorator';

import { createPinia } from 'pinia';

setup((app) => {
  const pinia = createPinia();
  app.use(pinia);
  // Registers your app's plugins into Storybook
  app.use(
    createVuetify({
      directives,
      ...config,
    }),
  );
});

// read more: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy
export const parameters = {
  layout: 'fullscreen',

  options: {
    storySort: {
      method: 'alphabetical',
      //      order: [],
      //      locales: '',
    },
  },

  ...envidatViewportParameters,

  docs: {
    codePanel: true,
  },
};

// read more: https://storybook.js.org/recipes/vuetify#register-vuetify-in-storybook
// decorator for vuetify is necessary
export const decorators = [withVuetifyTheme];

export const tags = [];
