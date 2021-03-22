/**
 * @summary story of baseClickCard for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-11-28 16:53:51
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';
import categoryCards from '@/modules/metadata/store/categoryCards';

export const methods = {
  onClick: action('clicked'),
};

storiesOf('3 Cards / Click Cards ', module).add('CategoryCcard Collection', () => ({
  components: { BaseClickCard },
  template: `
    <v-row>

      <v-col cols="6"
              v-for="card in categoryCards"
              :key="card.title">
        <base-click-card :title='card.title'
                          :img='card.img'
                          :color='card.color'
                          @click='onClick' />
      </v-col>

      <v-col col="4"
              v-for="card in categoryCards"
              :key="card.title">
        <base-click-card :title='card.title'
                          :img='card.img'
                          :color='card.color'
                          @click='onClick' />
      </v-col>

      <v-col cols="3"
              v-for="card in categoryCards"
              :key="card.title">
        <base-click-card :title='card.title'
                          :img='card.img'
                          :color='card.color'
                          @click='onClick' />
      </v-col>

    </v-row>`,
  methods,
  data: () => ({
    categoryCards,
  }),
}));
