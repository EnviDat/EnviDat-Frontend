/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import SloganCard from '@/modules/home/components/SloganCard';


export const methods = {
  onClick: action('clicked'),
};

storiesOf('3 Cards / Slogan Cards', module)
  .add('Collection of Slogan Cards', () => ({
    components: { SloganCard },
    template: `
    <v-container grid-list-lg fluid pa-0>
    <v-row >
      <v-col cols="12" sm="6" md="4" lg="3" >
        <slogan-card
            @click="onClick"
            :slogan="'Random Slogan'"
            :subSlogan="'Subslogan normally longer than the slogan'"
            :buttonText="'Fun button'"
            :buttonCallback="onClick"
        />
      </v-col>
    </v-row>
    </v-container>
    `,
    methods,
  }));
