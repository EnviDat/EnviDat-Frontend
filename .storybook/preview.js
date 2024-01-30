// noinspection ES6UnusedImports

import vuetify from './vuetify_storybook';

// import App component for the css for the components
// eslint-disable-next-line no-unused-vars
import App from '../src/App.vue';

import Vue from 'vue';
import globalMethods from '../src/factories/globalMethods';
import { envidatViewportParameters } from '~/stories/js/envidatViewports';

Vue.mixin(globalMethods);

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
};

export const decorators = [
  (Story) => ({
    vuetify,
    template: `
    <v-app class="vuetifyStorybookApp">
      <v-main >
        <v-container fluid class="pa-0">
          <story/>
        </v-container>
      </v-main>
    </v-app>
    `,
  }),
];
