import { addDecorator } from '@storybook/vue';
import vuetify from './vuetify_storybook';

// import App component for the css for the components
// eslint-disable-next-line no-unused-vars
import App from '../src/App.vue';

import Vue from 'vue';
import globalMethods from '../src/factories/globalMethods';

Vue.mixin(globalMethods);

addDecorator(() => ({
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
}));
