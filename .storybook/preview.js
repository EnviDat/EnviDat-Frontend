import { addDecorator } from '@storybook/vue';
import vuetify from './vuetify_storybook';

// import App component for the css for the components
import App from '../src/App.vue';

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
