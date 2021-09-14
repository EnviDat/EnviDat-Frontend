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
        
        <v-col>
          <div class="text-body-2">{{ cardInstructions1 }}</div>
          <div class="text-body-2">{{ cardInstructions2 }}</div>
        </v-col>

        <v-col>
          <div class="text-h6">{{ previewText }}</div>
        </v-col>

      </v-row>


      <v-row>

        <v-col>  
          <v-combobox
            v-click-outside="onClick"
            chips
            deletable-chips
            multiple
            outlined
            append-icon="arrow_drop_down"
            :label="keywordsLabel"
            :items="keywordsSource"
            item-text="name"
            :search-input.sync="search"
            v-model="keywords"
            @update:search-input="isKeywordValid(search)"
          >

            <template v-slot:selection="{ item }" >
              <tag-chip 
                v-click-outside="onClick"
                :name="item.name" 
                closeable
                selectable
                :color="item.color"
                @clickedClose="removeKeyword(item)"
              ></tag-chip>
            </template>
       
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title  v-if="keywordValidConcise">
                    No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new keyword.
                  </v-list-item-title>
                  <v-list-item-title  v-if="!keywordValidMin3Characters">
                     <span class="font-italic">Keyword must be at least three characters.</span>
                  </v-list-item-title>
                  <v-list-item-title v-if="!keywordValidConcise">
                    <span class="red--text font-italic">Each keyword tag may not exceed two words.</span>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>          

          </v-combobox>
        </v-col>

        <v-col>          
          <metadata-card
            :tags="metadataCardTags"
            :subtitle="metadataCardSubtitle"
            :title="metadataCardTitle" />
        </v-col>

      </v-row>

    
    </v-container>
  </v-card>  

</template>


<script>
/**
 * EditKeywords.vue renders Metadata Keywords combobox and a MetadataCard preview
 * 
 *
 * @summary shows the card for editing the keywords
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-14
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_KEYWORDS,
  eventBus,
} from '@/factories/eventBus';

import MetadataCard from '@/components/Cards/MetadataCard';
import TagChip from '@/components/Cards/TagChip';
import catCards from '@/store/categoryCards';


export default {
  name: 'EditKeywords',
  data: () => ({
    tags: [],
    search: null,
    keywordValidConcise: true,
    keywordValidMin3Characters: true,
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    metadataCardTitle() {
      return this.mixinMethods_getGenericProp('metadataCardTitle', '');
    },
    metadataCardSubtitle() {
      return this.mixinMethods_getGenericProp('metadataCardSubtitle', '');
    },
    keywordsSource() {
      return this.mixinMethods_getGenericProp('keywordsSource', []);
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
    // metadataCardTags: {
    //   get() {
    //     return this.mixinMethods_getGenericProp('metadataCardTags', []);
    //   },
    //   set() {
    //     return this.mixinMethods_getGenericProp('metadataCardTags', this.genericProps.keywords);
    //   },
    // },
    metadataCardTags() {

      if (typeof this.genericProps.keywords !== 'undefined' && this.genericProps.keywords.length > 0) {
        this.setTags();
        return this.tags;
        
        // return this.mixinMethods_getGenericProp('metadataCardTags', this.genericProps.keywords);
      }

      return this.tags;
      // return this.mixinMethods_getGenericProp('metadataCardTags', []);
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

          // If user enters keyword string and keyword is valid then push keyword object with these key value pairs:   
          //    name: <user string capitalized and white splace removed)
          //    color: <dynamically assigned vie getTagColor()>   
          if (typeof valuesArray[i] === 'string') {  
            
            // Check if keyword is valid, if not remove keyword entry from valuesArray and continue loop
            const keywordValid = this.isKeywordValid(valuesArray[i]);

            if (!keywordValid) {
              valuesArray.splice(i, 1);
              // eslint-disable-next-line no-continue
              continue;
            }

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
        
        // Update genericProps with valuesArray
        this.genericProps.keywords = valuesArray;
       
        // Emit { keywords: valuesArray } to eventBus
        this.setKeywords('keywords', valuesArray);
      
      },
    },
  },
  methods: {
    setTags() {
      this.tags = this.genericProps.keywords;
      // this.genericProps.metadataCardTags = this.genericProps.keywords;

    },
    // Updates tags to keywords if keywords exists and have at least one value
    onClick() {     
      if (typeof this.genericProps.keywords !== 'undefined' && this.genericProps.keywords.length > 0) {
        // this.genericProps.metadataCardTags = this.genericProps.keywords;
        this.setTags();
        // this.metadataCardTags();
      }
      // this.$emit('onClick', this.name);
    },
    removeKeyword(item) {

      // Assign removeKeyword to keyword item that will be removed
      this.genericProps.removeKeyword = item;

      // Assign removeIndex keywords object that matched removeKeyword 
      const removeIndex = this.genericProps.keywords.indexOf(this.genericProps.removeKeyword);
     
      // Remove object with index of removeIndex from keywords
      this.genericProps.keywords.splice(removeIndex, 1);

      // Emit { keywords: keywords } to eventBus 
      this.setKeywords('keywords', this.genericProps.keywords);
    },
    // Sets keyword validity variables
    // Returns true if keyword is valid, else returns false
    isKeywordValid(search) {

      // Call onClick() to assign user input to preview keyword tags
      this.onClick();

      if (search !== null) {

        // Sets keywordValidMin3Characters to true is trimmed search has more than two characters
        // Else sets keywordValidMin3Characters to false
        if (search.trim().length > 2) {
          this.keywordValidMin3Characters = true;
        } else {
          this.keywordValidMin3Characters = false;
        }
       
        // Sets keywordValidConcise to true if trimmed search is less than or equal to two words (split by space ' ')
        // Else sets keywordValidConcise to false
        const inputSplit = search.trim().split(' ');
        if (inputSplit.length <= 2) {
          this.keywordValidConcise = true;
        } else {
          this.keywordValidConcise = false;
        }
      }

      if (this.keywordValidMin3Characters && this.keywordValidConcise) {
        return true;
      } 
      return false;

    },
    // Returns true if keywordValidConcise is true, else returns warning string
    // rulesKeyword() {
    //   if (this.keywordValidConcise) {
    //     return true;
    //   }
    //   return 'Each keyword tag may not exceed two words.';
    // },
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
    MetadataCard,
    TagChip,
  },
};


</script>
