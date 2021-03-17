/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import Vue from 'vue';
import Vue2Filters from 'vue2-filters';

import globalMethods from '@/factories/globalMethods';

import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import ResourceCardPlaceholder from '@/modules/metadata/components/ResourceCardPlaceholder.vue';

import fileSizeIcon from '@/assets/icons/fileSize.png';
import doiIcon from '@/assets/icons/doi.png';
import dateCreatedIcon from '@/assets/icons/dateCreated.png';
import lastModifiedIcon from '@/assets/icons/dateModified.png';
import unFormatedMetadataCards from './js/metadata';

Vue.use(Vue2Filters);
Vue.mixin(globalMethods);

const apiFactory = require('@/factories/apiFactory');

function getIcons() {
  const icons = new Map();

  const imgPaths = require.context('@/assets/icons/', false, /\.png$/);

  imgPaths.keys().forEach((iconFileName) => {
    const splits = iconFileName.split('/');
    let key = splits[splits.length - 1];
    key = key.replace('.png', '');
    icons.set(key, iconFileName);
  });

  return icons;
}

const iconFiles = getIcons();

// let str = '';
// for (const [key, value] of iconFiles) {
//   str += `got key ${key} value ${value} \n`;
// }

// console.log(`icons ${str}`);

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  const formatted = apiFactory.solrResultToCKANJSON(el);
  // let keys = Object.keys(el.tags[0]);
  // let props = '';
  // keys.forEach(element => {
  //   props += element + ' ';
  // });
  // alert(typeof el.resources + ' resources: ' + el.resources.length + ' ' + el.resources instanceof Array);
  metadataCards.push(formatted);
});

export const methods = {
  onCardClick: action('clicked on card'),
  onTagClick: action('clicked on tag'),
};

storiesOf('3 Cards / Resource Cards', module)
  .add('Resource card collection', () => ({
    components: { ResourceCard },
    template: `
    <v-row >

      <v-col cols="3" class="pa-2"
              v-for="(res, index) in metadataCards[2].resources"
              :key="'cols-3_' + index" >

              <resource-card v-bind="res"
                              :doiIcon="doiIcon"
                              :dateCreatedIcon="dateCreatedIcon"
                              :lastModifiedIcon="lastModifiedIcon"
                              :fileExtensionIcon="iconFiles"
                              @clicked="onCardClick" />
      </v-col>

      <v-col cols="4" class="pa-2"
              v-for="(res, index) in metadataCards[2].resources"
              :key="'cols-4_' + index" >

        <resource-card v-bind="res"
                        :doiIcon="doiIcon"
                        :dateCreatedIcon="dateCreatedIcon"
                        :lastModifiedIcon="lastModifiedIcon"
                        :fileExtensionIcon="iconFiles"
                        @clicked="onCardClick" />
      </v-col>

      <v-col cols="6" class="pa-2"
            v-for="(res, index) in metadataCards[2].resources"
            :key="'cols-6_' + index" >

        <resource-card v-bind="res"
                        :doiIcon="doiIcon"
                        :dateCreatedIcon="dateCreatedIcon"
                        :lastModifiedIcon="lastModifiedIcon"
                        :fileExtensionIcon="iconFiles"
                        @clicked="onCardClick" />
      </v-col>

      <v-col cols="12" class="pa-2" >
        Resource Cards with Download disabled
      </v-col>

      <v-col cols="6" class="pa-2"
            v-for="(res, index) in metadataCards[2].resources"
            :key="'cols-6_' + index" >

        <resource-card v-bind="res"
                        :doiIcon="doiIcon"
                        :dateCreatedIcon="dateCreatedIcon"
                        :lastModifiedIcon="lastModifiedIcon"
                        :fileExtensionIcon="iconFiles"
                        :downloadActive="false"
                        @clicked="onCardClick" />
      </v-col>

    </v-row>
    `,
    methods,
    data: () => ({
      metadataCards,
      doiIcon,
      fileSizeIcon,
      dateCreatedIcon,
      lastModifiedIcon,
      iconFiles,
    }),
  }))

  .add('Resource Placeholder collection', () => ({
    components: { ResourceCardPlaceholder },
    template: `
    <v-row >

      <v-col cols="3" class="pa-2"
              v-for="index in 3"
              :key="index" >
        <resource-card-placeholder />
      </v-col>

      <v-col cols="4" class="pa-2"
              v-for="index in 3"
              :key="index" >
        <resource-card-placeholder twoColumnLayout />
      </v-col>

      <v-col cols="6" class="pa-2"
              v-for="index in 3"
              :key="index" >
        <resource-card-placeholder twoColumnLayout />
      </v-col>

    </v-row>
    `,
    methods,
    data: () => ({}),
  }));
