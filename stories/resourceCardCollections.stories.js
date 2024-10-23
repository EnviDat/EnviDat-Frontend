import ResourceCard from '@/modules/metadata/components/ResourceCard.vue';
import ResourceCardPlaceholder from '@/modules/metadata/components/ResourceCardPlaceholder.vue';

import { createResources } from '@/factories/metaDataFactory';
import unFormatedMetadataCards from './js/metadata';


const metadataCards = unFormatedMetadataCards;

const resources1 = createResources(metadataCards[2]);


export default {
  title: '3 Cards / Resource Cards / 3 Collections From Datasets',
  component: ResourceCard,
  parameters: {},
};

export const ResourceCardCollection = () => ({
  components: { ResourceCard },
  template: `
    <v-row>
      <v-col cols="3" class="pa-2" v-for="(res, index) in metadataCards[2].resources" :key="'1_' + index" >
        <resource-card
          v-bind="res"
        />
      </v-col>

      <v-col cols="4" class="pa-2" v-for="(res, index) in metadataCards[2].resources" :key="'2_' + index" >
        <resource-card
          v-bind="res"
          :isProtected="true"
        />
      </v-col>

      <v-col cols="12" class="pa-2" v-for="(res, index) in metadataCards[2].resources" :key="'3_' + index" >
        <resource-card
          v-bind="res"
        />
      </v-col>

      <v-col cols="3" class="pa-2" v-for="(res, index) in metadataCards[2].resources" :key="'4_' + index" >
        <resource-card
          v-bind="res"
          :deprecated="true"
        />
      </v-col>

      <v-col cols="12" class="pa-2 my-2" >
        <h2>Resource Cards with Download disabled</h2>
      </v-col>

      <v-col cols="6" class="pa-2" v-for="(res, index) in metadataCards[0].resources" :key="'5_' + index" >
        <resource-card
          v-bind="res"
          :downloadActive="false"
        />
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

export const ResourceCardDownloaded = () => ({
  components: { ResourceCard },
  template: `
    <v-row >
      
      <v-col cols="3" class="pa-2"
              v-for="(res, index) in resources"
              :key="'cols-3_' + index" >

              <resource-card v-bind="res"
                              :showGenericOpenButton="true"
                              :genericOpenButtonBottom="true"
                              openButtonTooltip="Open File in Preview"
                               />
      </v-col>

    </v-row>
    `,
  data: () => ({
    resources: resources1.resources,
  }),
});
