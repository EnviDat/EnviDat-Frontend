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
import categoryCards from '@/store/categoryCards';
import { getImages } from '@/factories/imageFactory';
import {
  mobileLargeViewportParams,
  mobileViewportParams,
  tabletViewportParams,
} from './js/envidatViewports';

const images = getImages();

for (let i = 0; i < categoryCards.length; i++) {
  const cardInfo = categoryCards[i];
  const imageKey = cardInfo.imgPath;

  cardInfo.img = images[imageKey];
}

export default {
  title: '3 Cards / Click Cards',
  component: BaseClickCard,
};

const baseInfo = categoryCards[0];

export const Basic = {
  args: {
    title: baseInfo.title,
    img: baseInfo.img,
    color: baseInfo.color,
  },
};

const Template = (args, { argTypes }) => ({
  components: { BaseClickCard },
  props: Object.keys(argTypes),
  // template: '<AuthorCard v-bind="$props" />',
  template: `
    <v-row >
      <v-col v-for="card in $props.categoryCards"
             cols='12'
             sm='6'
             class='pa-2'
             :key="card.title">
        <BaseClickCard :title="card.title"
                       :img='card.imgPath'
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

