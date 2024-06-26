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
import {
  envidatViewportParameters,
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from './js/envidatViewports';

const jpgAssetPaths = require.context('@/assets/', true, /\.jpg$/)
const jpgAssets = globalMethods.methods.mixinMethods_importImages(jpgAssetPaths);

for (let i = 0; i < categoryCards.length; i++) {
  const cardInfo = categoryCards[i];
  const imageKey = `./${cardInfo.imgPath}.jpg`;

  cardInfo.img = jpgAssets[imageKey];
}

export default {
  title: '3 Cards / Click Cards',
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};

const Template = (args, { argTypes }) => ({
  components: { BaseClickCard },
  props: Object.keys(argTypes),
  // template: '<AuthorCard v-bind="$props" />',
  template: `
    <v-row>
      <v-col v-for="card in $props.categoryCards"
             cols="12"
             sm="6"
             :key="card.title">
        
        <BaseClickCard :title="card.title"
                       :img='card.img'
                       :color='card.color' />
      </v-col>
    </v-row>
  `,
});


export const CategoryCardCollection = Template.bind({});
CategoryCardCollection.args = { categoryCards };

export const MobileCategoryCardCollection = Template.bind({});
MobileCategoryCardCollection.args = { ...CategoryCardCollection.args };
MobileCategoryCardCollection.parameters = mobileViewportParams;

export const MobileLargeCategoryCardCollection = Template.bind({});
MobileLargeCategoryCardCollection.args = { ...MobileCategoryCardCollection.args };
MobileLargeCategoryCardCollection.parameters = mobileLargeViewportParams;

export const TabletCategoryCardCollection = Template.bind({});
TabletCategoryCardCollection.args = { ...MobileCategoryCardCollection.args };
TabletCategoryCardCollection.parameters = tabletViewportParams;

