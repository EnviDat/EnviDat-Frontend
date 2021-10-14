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

          <v-combobox  @input="notifyChange('keywords', $event)"
                      :value="keywordsField"
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
              <TagChip  :name="item.name"
                        selectable
                        closeable
                        @clickedClose="removeKeyword(item)"
                        :isSmall="false"
                        />
            </template>

            <template v-slot:item="{ item }">
              <TagChip v-if="item && item.name"
                       :name="item.name"
                       selectable
                       @clicked="catchKeywordClicked"
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
 * Last modified  : 2021-10-06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {EDITMETADATA_KEYWORDS, EDITMETADATA_OBJECT_UPDATE, eventBus,} from '@/factories/eventBus';

import MetadataCard from '@/components/Cards/MetadataCard';
import TagChip from '@/components/Chips/TagChip';
import catCards from '@/store/categoryCards';
import {METADATA_NAMESPACE} from '@/store/metadataMutationsConsts';

import {enhanceTitleImg, getTagColor,} from '@/factories/metaDataFactory';

import {mapState} from 'vuex';


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
      cardInstructions1: 'Please enter at least 5 keywords for your metadata entry.',
      cardInstructions2: 'To use a new keyword not in dropdown list please type keyword and press enter.',
      previewText: 'Metadata card preview',
    },
    defaultUserEditMetadataConfig: {
      keywordsListWordMax: 2,
      keywordsCountMin: 5,
    },
  }),
  props: {
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
    keywords: {
      type: Array,
      default: () => [],
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
    keywordsListWordMax() {
      return this.config?.userEditMetadataConfig.keywordsListWordMax || this.defaultUserEditMetadataConfig.keywordsListWordMax;
    },
    keywordsField: {
      get() {
        return [...this.keywords];
      },
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
        const wordMaxHint = `Each keyword tag may not exceed ${this.keywordsListWordMax} words.`;
        return `<span class="red--text font-italic">${wordMaxHint}</span>`;
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
  },
  methods: {
    catchKeywordClicked(pickedKeyword) {

      // Use pickedKeyword to create pickedKeywordObj
      const pickedKeywordObj = {
        name: pickedKeyword.toUpperCase().trim(),
        color: getTagColor(catCards, pickedKeyword),
      };

      // Assign selectedKeywords to keywords concatenated with pickedKeywordObj
      const selectedKeywords = this.keywords.concat([pickedKeywordObj]);

      // Process and emit selectedKeywords to eventBus
      this.notifyChange('keywords', selectedKeywords);

    },
    processValues(valuesArray) {

      // Iterate through valuesArray
      for (let i = 0; i < valuesArray.length; i++) {

        // If user enters keyword string and keyword is valid then push keyword object with these key value pairs:
        //    name: <user string capitalized and white space removed)
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

      }

      // Remove duplicates from valuesArray
      valuesArray = [...new Set(valuesArray.map(a => JSON.stringify(a)))].map(a => JSON.parse(a));

      // Assign keywordCount to length of valuesArray
      this.keywordCount = valuesArray.length;

      // Call isEnoughKeywords()
      this.isEnoughKeywords();

      return valuesArray;

      },
    removeKeyword(item) {

      // Assign removeIndex to index of keywords object that match item
      const removeIndex = this.keywords.indexOf(item);
      // console.log(removeIndex);

      // Assign localKeywords to copy of keywords
      const localKeywords = [...this.keywords];

      // Remove object with index of removeIndex from localKeywords
      localKeywords.splice(removeIndex, 1);

      // Process and emit localKeywords to eventBus
      this.setKeywords('keywords', this.processValues(localKeywords));

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

        // Sets keywordValidMin3Characters to true if trimmed search has more than two characters
        // Else sets keywordValidMin3Characters to false
        this.keywordValidMin3Characters = search.trim().length > 2;

        // Sets keywordValidConcise to true if trimmed search is less than or equal to keywordsListWordMax words (split by space ' ')
        // Else sets keywordValidConcise to false
        const inputSplit = search.trim().split(' ');
        this.keywordValidConcise = inputSplit.length <= this.keywordsListWordMax;
      }

      return this.keywordValidMin3Characters && this.keywordValidConcise;
    },
    setKeywords(property, value) {
      const newKeywords = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_KEYWORDS,
        data: newKeywords,
      });

    },
    notifyChange(property, value) {

      const mergedKeywordsField = [ ...this.keywordsField, ...value];

      const cleanedKeywordsField = this.processValues(mergedKeywordsField);

      this.setKeywords(property, cleanedKeywordsField);

    },
  },
  components: {
    MetadataCard,
    TagChip,
  },
};

</script>
