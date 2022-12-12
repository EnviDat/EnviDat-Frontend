/* eslint-disable object-curly-newline */
// noinspection JSUnusedGlobalSymbols

/**
 * @summary story of SigninPage sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// eslint-disable-next-line import/extensions
import TextCardListLayout from '@/components/Layouts/TextCardListLayout.vue';
import ImageTextCard from '@/components/Layouts/ImageTextCard.vue';

import dataCreatorImg from '@/assets/cards/data_creator_small.jpg'
import integrationlist from './testdata/integrationlist.json';
import { LAYOUT_VIEWS } from './storybookFolder';


export default {
  title: `${LAYOUT_VIEWS} / Page layouts`,
  // component: TextCardListLayout,
  decorators: [],
  parameters: {},
};

export const TextCardListLayoutViews = () => ({
  components: {
    TextCardListLayout,
    ImageTextCard,
  },
  template: `
  <v-row >

    <v-col cols="12">
      Empty TextCardListLayout
    </v-col>

    <v-col cols="12">
      <TextCardListLayout  />
    </v-col>

    <v-col cols="12">
      TextCardListLayout with topLayout true
    </v-col>

    <v-col cols="12">
      <TextCardListLayout :listItems="entries"
                          :loadingImg="loadingImg">
        <template #entry="{ entry, loadingImg, titleCssClass, subtitleCssClass }">
          <ImageTextCard
              :height="300"
              :title="entry.title"
              :text="entry.text"
              :image="entry.image"
              :loadingImg="loadingImg"
              :titleCssClass="titleCssClass"
              :subtitleCssClass="subtitleCssClass"
              :imageTopLayout="true"
          >

          </ImageTextCard>
        </template>
      </TextCardListLayout>
    </v-col>

    <v-col cols="12">
      TextCardListLayout with topLayout false
    </v-col>

    <v-col cols="12">
      <TextCardListLayout :listItems="entries"
                          :loadingImg="loadingImg">
        <template #entry="{ entry, loadingImg, titleCssClass, subtitleCssClass }">
          <ImageTextCard
              :height="300"
              :title="entry.title"
              :text="entry.text"
              :image="entry.image"
              :loadingImg="loadingImg"
              :titleCssClass="titleCssClass"
              :subtitleCssClass="subtitleCssClass"
          >

          </ImageTextCard>
        </template>
      </TextCardListLayout>
    </v-col>

  </v-row>
  `,
  computed: {
  },
  data: () => ({
    entries: integrationlist,
    loadingImg: dataCreatorImg,
  }),
  methods: {
/*
    createClickMethod(){
      console.log('clicked create button');
    },
    existingClickCallback() {
      console.log('clicked existing button');
    },
    editingClickMethod(){
      console.log('clicked editing button');
    },
*/
  },
});
