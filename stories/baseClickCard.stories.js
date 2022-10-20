/**
 * @summary story of baseClickCard for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-20 15:55:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';
import globalMethods from '@/factories/globalMethods';
import categoryCards from '@/store/categoryCards';

import { CARD_VIEWS } from './storybookFolder';

const jpgAssetPaths = require.context('../src/assets/', true, /\.jpg$/)
const jpgAssets = globalMethods.methods.mixinMethods_importImages(jpgAssetPaths);

for (let i = 0; i < categoryCards.length; i++) {
  const cardInfo = categoryCards[i];
  const imageKey = `./${cardInfo.imgPath}.jpg`;

  cardInfo.img = jpgAssets[imageKey];
}

export default {
  title: `${CARD_VIEWS} / Click Cards`,
  decorators: [],
  parameters: {},
};

export const CategoryCardCollectionView = () => ({
  components: { BaseClickCard },
  template: `
    <v-row>

      <v-col cols="6"
              v-for="card in categoryCards"
              :key="card.title">
        <base-click-card :title='card.title'
                          :img='card.img'
                          :color='card.color' />
      </v-col>

      <v-col col="4"
              v-for="card in categoryCards"
              :key="card.title">
        <base-click-card :title='card.title'
                          :img='card.img'
                          :color='card.color' />
      </v-col>

      <v-col cols="3"
              v-for="card in categoryCards"
              :key="card.title">
        <base-click-card :title='card.title'
                          :img='card.img'
                          :color='card.color' />
      </v-col>

    </v-row>`,
  data: () => ({
    categoryCards,
  }),
});
