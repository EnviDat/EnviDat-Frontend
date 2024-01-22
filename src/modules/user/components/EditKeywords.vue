<template>

  <v-card id="EditKeywords"
          class="pa-0"
          :loading="loadingColor">

    <v-container fluid
                class="pa-4">

      <v-row>
        <v-col cols="6"
               class="text-h5">
          {{ labels.title }}
        </v-col>

        <v-col v-if="message" >
          <BaseStatusLabelView statusIcon="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails" />
        </v-col>
        <v-col v-if="error"  >

          <BaseStatusLabelView statusIcon="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails" />
        </v-col>

      </v-row>


      <v-row>
        <v-col class="text-body-1">
          <div >{{ labels.cardInstructions1 }}</div>
          <div >{{ labels.cardInstructions2 }}</div>
        </v-col>

        <v-col class="text-subtitle-1">
          {{ labels.previewText }}
        </v-col>
      </v-row>


      <v-row>
        <v-col>

          <v-combobox :value="keywordsField"
                      :items="existingKeywordItems"
                      item-text="name"
                      multiple
                      outlined
                      append-icon="arrow_drop_down"
                      prepend-icon="style"
                      :label="labels.keywordsLabel"
                      :placeholder="labels.placeholder"
                      :search-input.sync="search"
                      :readonly="isReadOnly('keywords')"
                      :hint="readOnlyHint('keywords')"
                      :error-messages="validationErrors.keywords"
                      @update:search-input="isKeywordValid(search)"
                      @keyup="blurOnEnterKey"
                      @input="isEnoughKeywords()"
                      @change="notifyChange('keywords', $event)"
                      @blur="saveChange()"
                      @keydown="catchKeywordEntered($event)"
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
import { mapState } from 'vuex';

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import MetadataCard from '@/components/Cards/MetadataCard.vue';
import TagChip from '@/components/Chips/TagChip.vue';
import catCards from '@/store/categoryCards';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import { enhanceTitleImg, getTagColor } from '@/factories/metaDataFactory';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';
import { EDIT_METADATA_KEYWORDS_TITLE } from '@/factories/metadataConsts';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';


export default {
  name: 'EditKeywords',
  data: () => ({
    search: null,
    keywordValidConcise: true,
    keywordValidMin3Characters: true,
    keywordCount: 0,
    rulesKeywords: [],
    labels: {
      title: EDIT_METADATA_KEYWORDS_TITLE,
      keywordsLabel: 'Keywords',
      placeholder: 'Pick keywords from the list or type in a new keyword',
      cardInstructions1: 'Please enter at least 5 keywords.',
      cardInstructions2: 'To pick a keyword click into the list, you can start typing to search for a existing keywords.' +
          ' To create a new keyword type it and press enter.',
      previewText: 'Metadata card preview',
    },
    defaultUserEditMetadataConfig: {
      keywordsListWordMax: 2,
      keywordsCountMin: 5,
    },
    validationErrors: {
      keywords: '',
    },
    previewKeywords: [],
    stepKey: EDITMETADATA_KEYWORDS,
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
    loading: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    messageDetails: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: String,
      default: null,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    ...mapState([
      'config',
    ]),
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    userEditMetadataConfig() {
      if (!this.$store) {
        return this.defaultUserEditMetadataConfig;
      }

      return this.config?.userEditMetadataConfig || this.defaultUserEditMetadataConfig;
    },
    keywordsCountMin() {
      return this.userEditMetadataConfig.keywordsCountMin;
    },
    keywordsListWordMax() {
      return this.userEditMetadataConfig.keywordsListWordMax;
    },
    keywordsField: {
      get() {
        return this.previewKeywords.length > 0 ? this.previewKeywords : this.keywords;
      },
    },
    metadataPreviewEntry() {

      const previewEntry = {
        title: this.metadataCardTitle,
        tags: this.keywordsField,
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
        hint += '<span class="font-italic">Keyword must be at least <strong>3 characters</strong>. </span> ';
      }

      if (this.search) {
        hint += ` No results matching "<strong>${this.search}</strong>". Press <span class="mx-1"><kbd>enter</kbd></span> to create a new keyword. `;
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
    validations() {
      return getValidationMetadataEditingObject(this.stepKey);
    },
  },
  methods: {
    blurOnEnterKey(keyboardEvent) {
      if (keyboardEvent.key === 'Enter' && keyboardEvent.target.value === '') {
        keyboardEvent.target.blur();
      }
    },
    saveChange() {
      if (this.previewKeywords.length > 0) {
        if (this.validateProperty('keywords', this.previewKeywords)) {
          this.setKeywords('keywords', this.previewKeywords);
        }
      }
    },
    clearPreviews() {
      this.previewKeywords = [];
    },
    validateProperty(property, value){
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
    catchKeywordEntered(event) {

      if (event.key === 'Enter') {
        const enteredKeyword = event.target.value;

        if (this.isKeywordValid(enteredKeyword)) {
          this.catchKeywordClicked(enteredKeyword);
        }
      }
    },
    catchKeywordClicked(pickedKeyword) {

      // Use pickedKeyword to create pickedKeywordObj
      const pickedKeywordObj = {
        name: pickedKeyword.toUpperCase().trim(),
        color: getTagColor(catCards, pickedKeyword),
      };

      // Assign selectedKeywords to keywords concatenated with pickedKeywordObj
      const selectedKeywords = this.keywordsField.concat([pickedKeywordObj]);

      this.previewKeywords = this.processValues(selectedKeywords);
      this.search = null;
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
            i--; // decrease to ensure not skipping the next entry becduse splice changes the index
          } else {

            valuesArray[i] = {
              name: valuesArray[i].toUpperCase()
                  .trim(),
              color: getTagColor(catCards, valuesArray[i]),
            };
          }
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
      const removeIndex = this.keywordsField.indexOf(item);
      // console.log(removeIndex);

      // Assign localKeywords to copy of keywords
      const localKeywords = [...this.keywordsField];

      // Remove object with index of removeIndex from localKeywords
      localKeywords.splice(removeIndex, 1);

      // Process and emit localKeywords to eventBus
      this.previewKeywords = this.processValues(localKeywords);
    },
    // Assign keywordCountEnough to true if keywordCount is greater than or equal to keywordsCountMin
    // Else assigns keywordCountEnough to false
    isEnoughKeywords() {
      const keywordCountEnough = this.keywordCount >= this.keywordsCountMin;

      if (!keywordCountEnough) {
        this.rulesKeywords = [`Please enter at least ${this.keywordsCountMin} keywords.`];
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
    notifyChange(property, value) {

      // const keywordsAmount = value.length;

      const mergedKeywordsField = [...this.keywordsField, ...value];

      // const cleanedAmount = cleanedKeywordsField.length;

      this.previewKeywords = this.processValues(mergedKeywordsField);
    },
    setKeywords(property, value) {
      const newKeywords = {
        ...this.$props,
        [property]: value,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_KEYWORDS,
        data: newKeywords,
      });

    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  components: {
    MetadataCard,
    TagChip,
    BaseStatusLabelView,
  },
};

</script>
