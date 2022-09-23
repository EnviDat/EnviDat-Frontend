/* eslint-disable import/no-extraneous-dependencies */
import SloganCard from '@/modules/home/components/SloganCard';

import fingertips from '../src/assets/cards/slogan/fingertips_small.webp';

import { CARD_VIEWS } from './storybookFolder';

export default {
  title: `${CARD_VIEWS} / Slogan Card`,
  decorators: [],
  parameters: {
  },
};

export const SolganCardsCollection = () => ({
    components: { SloganCard },
    template: `
    <v-container grid-list-lg fluid pa-0>
    <v-row >
      <v-col cols="12" sm="6" md="4" lg="3" >
        <slogan-card
            :slogan="'Random Slogan'"
            :subSlogan="'Subslogan normally longer than the slogan'"
            :buttonText="'Fun button'"
        />
      </v-col>

      <v-col cols="6" sm="4" md="3" lg="2" >
        <slogan-card
            :slogan="'Random Slogan'"
            :sloganImg="fingertips"
            :subSlogan="'Subslogan normally longer than the slogan'"
            :buttonText="'Fun button'"
        />
      </v-col>

      <v-col cols="6" md="4" lg="6" >
        <slogan-card
            :slogan="'Random Slogan'"
            :sloganImg="fingertips"
            :subSlogan="'Subslogan normally longer than the slogan'"
            :buttonText="'Fun button'"
        />
      </v-col>

     </v-row>
    </v-container>
    `,
    data: () => ({
      fingertips,
    }),
  });
