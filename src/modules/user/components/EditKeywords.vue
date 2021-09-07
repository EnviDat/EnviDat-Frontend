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
          <v-combobox
            chips
            deletable-chips
            multiple
            outlined
            append-icon="arrow_drop_down"
            :label="keywordsLabel"
            :items="keywordsSource"
            :search-input.sync="search"
            v-model="keywords"
          >

       
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new keyword.
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>          

          </v-combobox>
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

import keywordsTags from '@/modules/metadata/store/metadataTags';


export default {
  name: 'EditKeywords',
  data: () => ({
    search: null,
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
    
      const keywordsArray = [];

      for (let i = 0; i < keywordsTags.length; i++) {
        keywordsArray.push(keywordsTags[i].name);
      }

      return keywordsArray;
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
      set(valuesArray) {
     
        // Initialize arrays used to compare values and find duplicates
        const valuesComparer = [];                
        const indicesDuplicates = [];

        // Iterate through valuesArray
        for (let i = 0; i < valuesArray.length; i++) {
          
          // Convert lowercase strings to uppercase strings
          valuesArray[i] = valuesArray[i].toUpperCase();

          // Push first element of valuesArray to valuesComparer
          if (i === 0) {
            valuesComparer.push(valuesArray[i]);
          } 

          // If index is greater than 0 AND valuesComparer includes valuesArray element then push current index to indicesDuplicates
          // Else if index is greater than 0 then push current valuesArray element to valuesComparer
          if (i > 0 && valuesComparer.includes(valuesArray[i])) {
            indicesDuplicates.push(i);
          } else if (i > 0) {
            valuesComparer.push(valuesArray[i]);
          }

        }
    
        // Remove items from valuesArray that are duplicates using indicesDuplicates
        indicesDuplicates.forEach(index => valuesArray.splice(index, 1));
      
        // Remove duplicate keywords from valuesArray using uniqueSet
        const uniqueSet = new Set(valuesArray);
        valuesArray = [...uniqueSet];

        // Pass {keywords: valuesArray} to genericProps and emit to eventBus
        this.setKeywords('keywords', valuesArray);

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

      console.log(newKeywords);
    },
  },
  components: {
 //   EditImgPlaceholder,
  },
};


</script>
