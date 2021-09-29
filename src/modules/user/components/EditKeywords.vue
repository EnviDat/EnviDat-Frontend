<template>

  <v-card id="EditKeywords"
          class="pa-4">

    <v-container fluid
                class="pa-0">

      <v-row>
        <v-col class="text-h5">
          {{ labels.title }}
        </v-col>
      </v-row>


      <v-row>
        <v-col class="text-body-2">
          <div >{{ labels.cardInstructions1 }}</div>
          <div >{{ labels.cardInstructions2 }}</div>
        </v-col>

        <v-col class="text-subtitle-1">
          {{ labels.previewText }}
        </v-col>
      </v-row>


      <v-row>
        <v-col>

          <v-combobox v-model="keywordItems"
                      :items="existingKeywordItems"
                      item-text="name"
                      chips
                      deletable-chips
                      multiple
                      outlined
                      append-icon="arrow_drop_down"
                      prepend-icon="style"
                      :label="labels.keywordsLabel"
                      :search-input.sync="search"
                      @update:search-input="isKeywordValid(search)"
                      @blur="isEnoughKeywords()"
                      :rules="rulesKeywords"
                      >

            <template v-slot:selection="{ item }" >
              <TagChip :name="item.name"
                        closeable
                        @clickedClose="removeKeyword(item)"
                        :isSmall="false"
                        />
            </template>

            <template v-slot:item="{ item }">
              <TagChip v-if="item && item.name"
                       :name="item.name"
                       :isSmall="false" />
            </template>

            <template v-slot:no-data>
              <v-list-item v-html="autocompleteHint" />
            </template>

          </v-combobox>
        </v-col>

        <v-col>
          <MetadataCard v-bind="metadataPreviewEntry" />
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
import TagChip from '@/components/Chips/TagChip';
import catCards from '@/store/categoryCards';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import {
  enhanceTitleImg,
  getTagColor,
} from '@/factories/metaDataFactory';

import { mapState } from 'vuex';


export default {
  name: 'EditKeywords',
  data: () => ({
    search: null,
    keywordValidConcise: true,
    keywordValidMin3Characters: true,
    keywordCount: 0,
    keywordCountEnough: true,
    rulesKeywords: [],
    labels: {
      title: 'Edit Metadata Keywords',
      keywordsLabel: 'Click here to pick Keywords',
      cardInstructions1: 'Please enter keywords for your metadata entry.',
      cardInstructions2: 'To use a new keyword not in dropdown list please type keyword and press enter.',
      previewText: 'Metadata card preview',
    },
    defaultUserEditMetadataConfig: {
      keywordsListWordMax: 2,
      keywordsCountMin: 5,
    },
  }),
  props: {
    keywords: {
      type: Array,
      default: () => [],
    },
    existingKeywords: {
      type: Array,
      default: () => [],
    },
    metadataCardTitle: {
      type: String,
      default: '',
    },
    metadataCardSubtitle: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState([
      'config',
    ]),
    userEditMetadataConfig() {
      return this.config?.userEditMetadataConfig || this.defaultUserEditMetadataConfig;
    },
    keywordsCountMin() {
      return this.config?.userEditMetadataConfig.keywordsCountMin || this.defaultUserEditMetadataConfig.keywordsCountMin;
    },
    metadataPreviewEntry() {

      const previewEntry = {
        title: this.metadataCardTitle,
        tags: this.keywords,
        subtitle: this.metadataCardSubtitle,
        fileIconString: this.mixinMethods_getIcon('file'),
      };

      if (this.$store) {
        const { categoryCards, cardBGImages } = this.$store.getters;
        enhanceTitleImg(previewEntry, cardBGImages, categoryCards);
      }

      return previewEntry;
    },
    autocompleteHint() {
      if (!this.keywordValidConcise) {
        return '<span class="red--text font-italic">Each keyword tag may not exceed two words</span> ';
      }

      let hint = '';

      if (!this.keywordValidMin3Characters) {
        hint += '<span class="font-italic">Keyword must be at least three characters. </span> ';
      }

      if (this.search) {
        hint += ` No results matching "<strong>${this.search}</strong>". Press  <kbd>enter</kbd>  to create a new keyword.`;
      } else {
        hint += ' Start typing for keyword autocompletion.';
      }

      return hint.trim();
    },
    existingKeywordItems() {
      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingKeywords`];
      }

      return this.existingKeywords;
    },
    keywordItems: {
      get() {
        return this.keywords;
      },
      set(valuesArray) {
        this.removeDuplicates(valuesArray);

        this.setKeywords(valuesArray);
      },
    },
  },
  methods: {
    removeDuplicates(valuesArray) {
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
            color: getTagColor(catCards, valuesArray[i]),
          };
        }

          // If index is greater than 0 AND valuesComparer includes valuesArray element then push current index to indicesDuplicates
          // Else if index is greater than 0 then push current valuesArray element to valuesComparer
          if (i > 0 && valuesComparer.includes(valuesArray[i].name)) {
            indicesDuplicates.push(i);
          } else {
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

        // Assign keywordCount to length of valuesArray
        this.keywordCount = valuesArray.length;

        // Call isEnoughKeywords()
        this.isEnoughKeywords();

        // Emit { keywords: valuesArray } to eventBus
        this.setKeywords(valuesArray);
      },
    removeKeyword(item) {

      // Assign removeIndex keywords object that matched removeKeyword
      const removeIndex = this.keywords.indexOf(item);

      // Remove object with index of removeIndex from keywords
      this.keywords.splice(removeIndex, 1);

      // Assign keywordCount to length of this.genericProps.keywords
      this.keywordCount = this.keywords.length;

      // Call isEnoughKeywords()
      this.isEnoughKeywords();

      // Emit { keywords: keywords } to eventBus
      this.setKeywords(this.keywords);
    },
    // Assign keywordCountEnough to true if keywordCount is greater than or equal to keywordsCountMin
    // Else assigns keywordCountEnough to false
    // Call setRulesKeyword()
    isEnoughKeywords() {
      this.keywordCountEnough = this.keywordCount >= this.keywordsCountMin;
      this.setRulesKeyword();
    },
    setRulesKeyword() {
      if (!this.keywordCountEnough) {
        this.rulesKeywords = [`Please enter at least ${this.keywordsCountMin} keyword entries.`];
      } else {
        this.rulesKeywords = [true];
      }
    },
    // Sets keyword validity variables
    // Returns true if keyword is valid, else returns false
    isKeywordValid(search) {

      if (search !== null) {

        // Sets keywordValidMin3Characters to true is trimmed search has more than two characters
        // Else sets keywordValidMin3Characters to false
        this.keywordValidMin3Characters = search.trim().length > 2;

        // Sets keywordValidConcise to true if trimmed search is less than or equal to two words (split by space ' ')
        // Else sets keywordValidConcise to false
        const inputSplit = search.trim().split(' ');
        this.keywordValidConcise = inputSplit.length <= 2;
      }

      return this.keywordValidMin3Characters && this.keywordValidConcise;
    },
    setKeywords(value) {
      const newKeywords = {
        ...this.$props,
        keywords: value,
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
