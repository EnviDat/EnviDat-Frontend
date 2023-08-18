// noinspection JSUnusedGlobalSymbols
/* eslint-disable */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 20:26:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataResources from '@/modules/metadata/components/Metadata/MetadataResources.vue';

import { createResources } from '@/factories/metaDataFactory';
import { getFrontendDates } from '@/factories/mappingFactory';

import doiIcon from '../src/assets/icons/doi.png';
import fileSizeIcon from '../src/assets/icons/fileSize.png';
import fileIcon from '../src/assets/icons/file.png';

// metadata gets enhance in the storybook config
import metadata from './js/metadata';

const resources1 = createResources(metadata[1]);
const resources2 = createResources(metadata[2]);

const resources1Dates = getFrontendDates(metadata[1].date);
const resources2Dates = getFrontendDates(metadata[2].date);


export default {
  title: '6 Detail Views / Metadata Detail Page View',
  decorators: [],
  parameters: {},
};

export const MetadataResourcesViews = () => ({
  components: { MetadataResources },
  template: `
  <v-row >

    <v-col cols="12" class="py-3">
      <MetadataResources :genericProps="genericPropsPlaceholder"
                          :showPlaceholder="genericPropsPlaceholder.showPlaceholder" />
    </v-col>

    <v-col cols="12" class="py-3">
      <MetadataResources :genericProps="genericProp"
                          :showPlaceholder="genericProp.showPlaceholder" />
    </v-col>

    <v-col cols="12" class="py-3">
      <MetadataResources :genericProps="genericProps2"
                          :showPlaceholder="genericProps2.showPlaceholder" />
    </v-col>

  </v-row>
  `,
  updated() {
  },
  data: () => ({
    genericProp: {
      resources: resources1.resources,
      dates: resources1Dates,
      showPlaceholder: false,
      doiIcon,
      fileIcon,
      fileSizeIcon,
    },
    genericPropsPlaceholder: {
      resources: null,
      showPlaceholder: true,
    },
    genericProps2: {
      resources: resources2.resources,
      dates: resources2Dates,
      showPlaceholder: false,
      doiIcon,
      fileIcon,
      fileSizeIcon,
    },
  }),
});
