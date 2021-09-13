<template>

  <v-card id="EditKeywords"
          class="pa-4">

    <v-container fluid
                class="pa-0">
    
      <v-row>
        <v-col > 
          <div class="text-h5">{{ cardTitle }}</div>
        </v-col>
      </v-row>


      <v-row>
        <v-col > 
          <div class="text-body-1">{{ cardInstructions1 }}</div>
          <div class="text-body-1">{{ cardInstructions2 }}</div>
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
            :rules="[rulesKeyword]"
            :label="keywordsLabel"
            :items="keywordsSource"
            item-text="name"
            :search-input.sync="search"
            v-model="keywords"
            @update:search-input="isKeywordValid(search)"
          >

            <template v-slot:selection="{ item }">
              <tag-chip 
                :name="item.name" 
                closeable
                selectable
                :color="item.color"
              ></tag-chip>
            </template>
       
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title  v-if="keywordValid">
                    No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new keyword.
                  </v-list-item-title>
                  <v-list-item-title v-else>
                    <span class="red--text"> Each keyword tag may not exceed two words.</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>          

          </v-combobox>
        </v-col>

        <v-col> 
          <div class="text-body-1">{{ previewText }}</div>
          <!-- TODO implement MetadataCard -->
            <!-- <MetadataCard >
            </MetadataCard> -->
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
 * Last modified  : 2021-09-13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_KEYWORDS,
  eventBus,
} from '@/factories/eventBus';

import keywordsTags from '@/modules/metadata/store/metadataTags';
// import MetadataCard from '@/components/Cards/MetadataCard';
import TagChip from '@/components/Cards/TagChip';
import catCards from '@/store/categoryCards';


export default {
  name: 'EditKeywords',
  data: () => ({
    search: null,
    keywordValid: true,
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    keywordsSource() {
    
      const keywordsArray = [...keywordsTags];
     
      for (let i = 0; i < keywordsArray.length; i++) {
        keywordsArray[i].color = this.getTagColor(catCards, keywordsArray[i].name);
      }

      return keywordsArray;
    },
    cardTitle() {
      return this.mixinMethods_getGenericProp('cardTitle', 'Metadata Keywords');
    },
    cardInstructions1() {
      return this.mixinMethods_getGenericProp('cardInstructions1', 'Please enter keywords for your metadata entry.');
    },
    cardInstructions2() {
      return this.mixinMethods_getGenericProp('cardInstructions2', 'To use a new keyword not in dropdown list please type keyword and press enter.');
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
      // TODO finish updating set method to use array of objects rather than an array of strings
      set(valuesArray) {

        // TODO add check to make sure new value does not exceed two words? 

        // Initialize arrays used to compare values and find duplicates
        const valuesComparer = [];
        const indicesDuplicates = [];

        // Iterate through valuesArray
        for (let i = 0; i < valuesArray.length; i++) {

          // If user enters keyword string then push keyword object with these key value pairs:   
          //    name: <user string capitalized and white splace removed)
          //    color: <dynamically assigned vie getTagColor()>   
          if (typeof valuesArray[i] === 'string') {            
            valuesArray[i] = {
              name: valuesArray[i].toUpperCase().trim(),
              color: this.getTagColor(catCards, valuesArray[i]),
            };
          }

          // Push first element of valuesArray to valuesComparer
          if (i === 0) {
            valuesComparer.push(valuesArray[i].name);
          }

          // If index is greater than 0 AND valuesComparer includes valuesArray element then push current index to indicesDuplicates
         // Else if index is greater than 0 then push current valuesArray element to valuesComparer
          if (i > 0 && valuesComparer.includes(valuesArray[i].name)) {
            indicesDuplicates.push(i);
          } else {
            valuesComparer.push(valuesArray[i].name);
          }

        }

        // Remove items from valuesArray that are duplicates using indicesDuplicates
        indicesDuplicates.forEach(index => valuesArray.splice(index, 1));
       
        // Pass {keywords: valuesArray } to genericProps and emit to eventBus
        this.setKeywords('keywords', valuesArray);

      },
    },
  },
  methods: {
    // Sets keywordValid to true if search is less than or equal to two words (split by space ' '), else sets keywordValid to false
    isKeywordValid(search) {

      if (search !== null) {
        
        const inputSplit = search.split(' ');

        if (inputSplit.length <= 2) {
          this.keywordValid = true;
        } else {
          this.keywordValid = false;
        }
      }

    },
    // Returns true if keywordValid is true, else returns warning string
    rulesKeyword() {
      if (this.keywordValid) {
        return true;
      }
      return 'Each keyword tag may not exceed two words.';
    },
    getTagColor(categoryCards, tagName) {

      if (!categoryCards || !tagName) {
        return '';
      }

      for (let i = 0; i < categoryCards.length; i++) {
        const cat = categoryCards[i];
        const name = tagName.toLowerCase();

        if (name.includes(cat.type) || cat.alias.includes(name)) {
          return cat.darkColor;
        }
      }

      return '#e0e0e0';
    },
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
 //   MetadataCard,
    TagChip,
  },
};


</script>
