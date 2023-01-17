
import Vue from 'vue';

import globalMethods from '@/factories/globalMethods';
import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import ResourceCardPlaceholder from '@/modules/metadata/components/ResourceCardPlaceholder.vue';

import dateCreatedIcon from '../src/assets/icons/dateCreated.png';
import lastModifiedIcon from '../src/assets/icons/dateModified.png';
import doiIcon from '../src/assets/icons/doi.png';
import fileSizeIcon from '../src/assets/icons/fileSize.png';
import unFormatedMetadataCards from './js/metadata';


Vue.mixin(globalMethods);

const iconImgPath = require.context('@/assets/icons/', false, /\.png$/);
const iconFiles = globalMethods.methods.mixinMethods_importImages(iconImgPath);

// let str = '';
// for (const [key, value] of iconFiles) {
//   str += `got key ${key} value ${value} \n`;
// }

// console.log(`icons ${str}`);

const metadataCards = unFormatedMetadataCards;

metadataCards[2].resources[0].loading = true;

const methods = {
//  onCardClick: action('clicked on card'),
//  onTagClick: action('clicked on tag'),
};

export default {
  title: '3 Cards / Resource Cards',
  decorators: [],
  parameters: {
  },
};

export const ResourceCardCollection = () => ({
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
                        :isProtected="true"
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
            v-for="(res, index) in metadataCards[0].resources"
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
  });

export const ResourceCardWithPreview = () => ({
    components: { ResourceCard },
    template: `
    <v-row >

      <v-col cols="3" class="pa-2"
              v-for="(res, index) in metadataCards[2].resources"
              :key="'cols-3_' + index" >

              <resource-card v-bind="res"
                              description="Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, "
                              :doiIcon="doiIcon"
                              :dateCreatedIcon="dateCreatedIcon"
                              :lastModifiedIcon="lastModifiedIcon"
                              :fileExtensionIcon="iconFiles"
                              :showGenericOpenButton="true"
                              :genericOpenButtonBottom="true"
                              openButtonTooltip="Open File in Preview"
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
  });

export const ResourceCardPlaceholders = () => ({
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
  });
