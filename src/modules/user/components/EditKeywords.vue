<template>

  <v-card id="EditKeywords"
          class="pa-4">

    <v-container fluid
                class="pa-0">

   
      <!-- <EditImgPlaceholder title="Edit Keywords"
                          :disclaimer="disclaimer"
                          :img="keywordsScreenshot"
                          /> -->

    
      <v-row>
        <v-col > 
          <div class="text-h5">{{ cardTitle }}</div>
        </v-col>
      </v-row>


      <v-row>
        <v-col > 
          <div class="text-body-1">{{ cardInstructions }}</div>
        </v-col>
      </v-row>


      <v-row>
        
        <v-col > 
          <v-autocomplete
            chips
            deletable-chips
            multiple
            outlined
            append-icon="arrow_drop_down"
            :label="keywordsLabel"
            :items="keywordsSource"
            v-model="keywords"
          ></v-autocomplete>
        </v-col>

        <v-col> 
          <div class="text-body-1">{{ previewText }}</div>
            <!-- TODO insert MetadataCard Component here -->
        </v-col>

      </v-row>

    
    </v-container>
  </v-card>  

</template>


<script>
/**
 * TODO update component description
 * EditKeywords.vue renders the Image Placeholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows the card for editing the keywords
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

// import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
// import keywordsScreenshot from '@/modules/user/assets/placeholders/keywords.jpg';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_KEYWORDS,
  eventBus,
} from '@/factories/eventBus';


export default {
  name: 'EditKeywords',
  data: () => ({
    // keywordsScreenshot,
    // disclaimer: `The screenshot below serves as a preview of the future component.
    //           Even if you can't interacte, please think about the information shown and if the grouping of the information to 
    //           edit would make sense in the context of the steps and substeps.`,
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    keywordsSource() {
      return ['foo', 'bar', 'fizz', 'buzz'];
    },
    cardTitle() {
      return this.mixinMethods_getGenericProp('cardTitle', 'Metadata Keywords');
    },
    cardInstructions() {
      return this.mixinMethods_getGenericProp('cardInstructions', 'Please enter keywords for your metadata entry.');
    },
    keywordsLabel() {
      return this.mixinMethods_getGenericProp('keywordsLabel', 'Keywords');
    },
    previewText() {
      return this.mixinMethods_getGenericProp('previewText', 'Preview');
    },
    keywords: {
      get() {
        return this.mixinMethods_getGenericProp('keywords', '');
      },
      set(value) {
        this.setKeywords('keywords', value);
      },
    },
  },
  methods: {
    setKeywords(property, value) {
      const newKeywords = {
        ...this.genericProps,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_KEYWORDS,
        data: newKeywords,
      });
    },
  },
  components: {
 //   EditImgPlaceholder,
  },
};


</script>
