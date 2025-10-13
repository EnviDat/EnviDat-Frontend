/* eslint-disable object-curly-newline,no-console */
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
import IntroductionCard from '@/components/Cards/IntroductionCard.vue';
import { enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';

import metadataCards from '@/../stories/js/metadata';


const dataset = metadataCards[0];
export default {
  title: '1 Base / Cards /  Introduction Card',
  component: IntroductionCard,
};

const currentLocalDataset = {
  title: dataset.title,
  subtitle: dataset.notes,
  tags: dataset.tags,
  flatLayout: true,
};

enhanceMetadatasTitleImage([currentLocalDataset]);

export const IntroductionCardViews = () => ({
  components: { IntroductionCard },
  template: `
  <v-row >

    <v-col cols="12">
      <IntroductionCard  />
    </v-col>

    <v-col cols="12">
      <IntroductionCard :userName="userName"
                        :createClickCallback="createClickMethod"
                        :existingClickCallback="existingClickCallback"
                        :editingClickCallback="editingClickMethod"
                        :publishedDatasetCount="123"
                        :unpublishedDatasetCount="2"
                        />
    </v-col>

    <v-col cols="12">
      <IntroductionCard :userName="userName"
                        :createClickCallback="createClickMethod"
                        :publishedDatasetCount="123"
                        :unpublishedDatasetCount="2"
                        :editingDatasetCount="1"
                        :currentLocalDataset="currentLocalDataset" />
    </v-col>

    <v-col cols="12">
      <IntroductionCard :userName="userName"
                        :createClickCallback="createClickMethod"
                        :publishedDatasetCount="123"
                        :unpublishedDatasetCount="2"
                        :editingDatasetCount="1" />
    </v-col>

  </v-row>
  `,
  data: () => ({
    userName: 'Dominik Haas',
    currentLocalDataset,
  }),
  methods: {
    createClickMethod(){
      console.log('clicked create button');
    },
    existingClickCallback() {
      console.log('clicked existing button');
    },
    editingClickMethod(){
      console.log('clicked editing button');
    },
  },
});
