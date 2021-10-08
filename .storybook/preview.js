// import { addDecorator } from '@storybook/vue';
// noinspection ES6UnusedImports

import vuetify from './vuetify_storybook';

// import App component for the css for the components
// eslint-disable-next-line no-unused-vars
import App from '../src/App.vue';

import Vue from 'vue';
import globalMethods from '../src/factories/globalMethods';

Vue.mixin(globalMethods);

export const parameters = {};

export const decorators = [
  (Story) => ({
    vuetify,
    template: `
    <v-app style="font-family: 'Raleway, sans-serif' !important;">
      <v-main>
        <v-container fluid >
          <story/>
        </v-container>
      </v-main>
    </v-app>
    `,
  }),
];

/*export const decorators = [
//addDecorator(() => (
  {
  vuetify,
  template: `
    <v-app style="font-family: 'Raleway, sans-serif' !important;">
      <v-main>
        <v-container fluid >
          <story/>
        </v-container>
      </v-main>
    </v-app>
    `,
  }
// ));
];*/
