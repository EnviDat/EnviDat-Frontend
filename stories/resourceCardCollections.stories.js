
import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import ResourceCardPlaceholder from '@/modules/metadata/components/ResourceCardPlaceholder.vue';

import unFormatedMetadataCards from './js/metadata';

const metadataCards = unFormatedMetadataCards;


export default {
  title: '3 Cards / Resource Cards / 3 Collections From Datasets',
  component: ResourceCard,
  decorators: [],
  parameters: {
  },
};


export const ResourceCardCollection = () => ({
    components: { ResourceCard },
    template: `
    <v-row>

      <v-col 
        cols="3"
        class="pa-2"
        v-for="(res, index) in metadataCards[2].resources"
        :key="'cols-3_' + index"
      >
        <resource-card v-bind="res" />
      </v-col>

      <v-col
        cols="4"
        class="pa-2"
        v-for="(res, index) in metadataCards[2].resources"
        :key="'cols-4_' + index"
      >
        <resource-card v-bind="res" is-protected />
      </v-col>

      <v-col 
        cols="6" 
        class="pa-2"
        v-for="(res, index) in metadataCards[2].resources"
        :key="'cols-6_' + index"
      >
        <resource-card v-bind="res" />
      </v-col>

      <v-col cols="12" class="pa-2" >
        Resource Cards with Download disabled
      </v-col>

      <v-col
        cols="6"
        class="pa-2"
        v-for="(res, index) in metadataCards[0].resources"
        :key="'cols-6_' + index"
      >
        <resource-card v-bind="res" :downloadActive="false" />
      </v-col>

    </v-row>
    `,
    data: () => ({
      metadataCards,
    }),
  });

export const ResourceCardWithPreview = () => ({
    components: { ResourceCard },
    template: `
    <v-row >
      <v-col 
        cols="3" 
        class="pa-2"
        v-for="(res, index) in metadataCards[2].resources"
        :key="'cols-3_' + index" 
      >
        <resource-card 
          v-bind="res"
          description="Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, Very long description, "
          :showGenericOpenButton="true"
          :genericOpenButtonBottom="true"
          openButtonTooltip="Open File in Preview"
        />
      </v-col>
    </v-row>
    `,
    data: () => ({
      metadataCards,
    }),
  });

export const ResourceCardPlaceholders = () => ({
    components: { ResourceCardPlaceholder },
    template: `
    <v-row >
      <v-col 
        cols="3" 
        class="pa-2"
        v-for="index in 3"
        :key="index"
      >
        <resource-card-placeholder />
      </v-col>

      <v-col 
        cols="4" 
        class="pa-2"
        v-for="index in 3"
        :key="index" 
      >
        <resource-card-placeholder twoColumnLayout />
      </v-col>

      <v-col 
        cols="6" 
        class="pa-2"
        v-for="index in 3"
        :key="index" 
      >
        <resource-card-placeholder twoColumnLayout />
      </v-col>

    </v-row>
    `,
    data: () => ({}),
  });
