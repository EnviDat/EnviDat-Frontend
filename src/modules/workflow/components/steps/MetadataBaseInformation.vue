<template>
  <v-container id="MetadataBaseInformation" fluid class="pa-4">
    <!-- Title box -->
    <v-row class="mb-0">
      <v-col class="text-h5 font-weight-bold" cols="12">
        {{ labels.stepTitle }}
      </v-col>
      <!-- <v-col cols="12" class="text-body-1">
        {{ labels.instructions }}
      </v-col> -->
    </v-row>

    <!-- Info Banner -->
    <v-row>
      <v-col class="mb-5 pt-0 pb-0">
        <v-alert
          type="info"
          closable
          :icon="false"
          class="rounded-lg info-banner"
        >
          <v-alert-title class="mb-2">Information</v-alert-title>
          <p>
            This section defines the main identification metadata of your
            dataset. These fields are essential for discovery and citation of
            your data.
          </p>

          <p><strong>Tips:</strong></p>
          <ol>
            <li>- Choose a clear and descriptive title.</li>
            <li>
              - Use keywords that reflect the content, methods, and geography of
              your data.
            </li>
            <li>
              - In the description, provide enough context so other researchers
              can understand what your dataset contains, how it was generated,
              and any limitations.
            </li>
          </ol>

          <p class="mt-2">
            You can format the description using <strong>Markdown</strong>
            (e.g., lists, links, bold text).
          </p>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Preview -->
    <v-col cols="12" class="pa-0 mb-5 mt-5">
      <MetadataHeader v-bind="metadataPreviewEntry" />
    </v-col>

    <!-- <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col> -->

    <v-row>
      <!-- title -->
      <v-col cols="12" xl="6" class="mb-0">
        <v-row class="mb-5">
          <v-col>
            <div class="font-weight-bold">{{ labels.title }}</div>
            <div class="text-caption">
              {{ labels.instructionsTitle }}
            </div>
          </v-col>
        </v-row>
        <v-text-field
          ref="metadataTitle"
          :id="'metadataTitle'"
          data-field="metadataTitle"
          :label="labels.labelTitle"
          :readonly="isReadOnly(false)"
          :error-messages="validationErrors?.metadataTitle"
          hide-details="auto"
          persistent-hint
          :hint="readOnlyHint(false)"
          :prepend-icon="mdiBookOpenVariantOutline"
          :placeholder="labels.placeholderTitle"
          :model-value="metadataTitleField"
          @keyup="blurOnEnterKey"
          @input="setTitleInput($event.target.value)"
          @change="notifyTitleChange($event.target.value)"
        />
      </v-col>

      <!-- Keywords -->

      <v-col cols="12" xl="6" class="mb-0">
        <v-row class="mb-5">
          <v-col>
            <div class="font-weight-bold">{{ labelsKeywords.title }}</div>
            <div class="text-caption">
              {{ labelsKeywords.cardInstructions1 }}
            </div>
          </v-col>
        </v-row>
        <v-autocomplete
          data-field="keywords"
          v-model="keywordsField"
          item-text="name"
          item-value="name"
          :items="existingKeywordItems"
          :menu-icon="mdiArrowDownDropCircleOutline"
          :readonly="isReadOnly('keywords')"
          :hint="readOnlyHint('keywords')"
          :persistent-hint="!!hint"
          :prepend-icon="mdiPaletteSwatch"
          :label="labelsKeywords.placeholder"
          :clear-on-select="true"
          multiple
          :search="search"
          :error-messages="validationErrors?.keywords"
          @update:search="
            search = $event;
            isKeywordValid(search);
          "
          @input="isEnoughKeywords()"
          @keydown="catchKeywordEntered($event)"
          :rules="rulesKeywords"
        >
          <template v-slot:selection="{ item }">
            <TagChip
              :name="item.value"
              selectable
              closeable
              @clicked="removeKeyword(item.raw)"
              :isSmall="false"
            />
          </template>

          <template v-slot:item="{ item, props }">
            <v-list-item
              @click="catchKeywordClicked(item.value)"
              v-bind="props"
            />
          </template>

          <template v-slot:no-data>
            <v-list-item>
              <div v-html="autocompleteHint"></div>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
      <!-- description -->
      <v-col cols="12" class="mb-5">
        <v-row class="mb-5">
          <v-col>
            <div class="font-weight-bold">
              {{ labelsDescription.title }}
            </div>
            <div
              v-html="labelsDescription.descriptionInstructions"
              class="text-caption"
            ></div>
          </v-col>
        </v-row>
        <GenericTextareaPreviewLayout
          data-field="metadataDescription"
          columns="12"
          v-bind="genericTextAreaObject"
          :textarea-content="metadataDescriptionField"
          :validationError="validationErrors?.metadataDescription"
          :readonly="isReadOnly('metadataDescription')"
          :hint="readOnlyHint('metadataDescription')"
          @inputedText="onDescriptionInput"
          @changedText="onDescriptionChange"
        >
          <MetadataDescription v-bind="descriptionObject" />
        </GenericTextareaPreviewLayout>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * EditMetadataHeader.vue shows the title, main contact email, main contact given name,
 * main contact surname, and metadata header preview.
 *
 *
 * @summary shows the title, main contact information, and header preview
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  mdiBookOpenVariantOutline,
  mdiText,
  mdiPaletteSwatch,
  mdiArrowDownDropCircleOutline,
} from '@mdi/js';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';
import TagChip from '@/components/Chips/TagChip.vue';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
// import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
// import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
// import ExpandableLayout from '@/components/Layouts/ExpandableLayout.vue';
import categoryCards from '@/store/categoryCards';

import { getTagColor } from '@/factories/keywordsFactory';

// import { getMetadataUrlFromTitle } from '@/factories/mappingFactory';
import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';
import MetadataDescription from '@/modules/metadata/components/Metadata/MetadataDescription.vue';
import { enhanceTitleImg } from '@/factories/metaDataFactory.js';

export default {
  name: 'MetadataBaseInformation',
  props: {
    metadataTitle: {
      type: String,
      default: '',
    },
    metadataDescription: {
      type: String,
      default: '',
    },
    validationErrors: {
      type: Object,
      default: () => {},
    },
    keywords: {
      type: Array,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
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

  computed: {
    metadataPreviewEntry() {
      const previewEntry = {
        metadataTitle: this.metadataTitleField || 'Your Research Dataset Title',
        tags: this.keywordsField,
        showCloseButton: false,
      };

      enhanceTitleImg(previewEntry);

      return previewEntry;
    },
    keywordsCountMin() {
      return this.defaultUserEditMetadataConfig.keywordsCountMin;
    },
    keywordsListWordMax() {
      return this.defaultUserEditMetadataConfig.keywordsListWordMax;
    },
    descriptionObject() {
      return {
        description: this.metadataDescriptionField,
        maxTextLength: 5000,
      };
    },

    metadataTitleField() {
      return this.newDatasetInfo.metadataTitle !== undefined
        ? this.newDatasetInfo.metadataTitle
        : this.metadataTitle;
    },
    metadataDescriptionField() {
      return this.newDatasetInfo?.metadataDescription
        ? this.newDatasetInfo.metadataDescription
        : this.metadataDescription;
    },
    keywordsField: {
      get() {
        return this.newDatasetInfo?.keywords?.length > 0
          ? this.newDatasetInfo.keywords
          : this.keywords;
      },
      set(v) {
        this.newDatasetInfo.keywords = this.processValues(v);
        this.keywordsChanged();
      },
    },

    autocompleteHint() {
      if (!this.keywordValidConcise) {
        const wordMaxHint = `Each keyword tag may not exceed ${this.keywordsListWordMax} words.`;
        return `<span class="text-red font-italic">${wordMaxHint}</span>`;
      }

      let hint = '';

      if (!this.keywordValidMin3Characters) {
        hint +=
          '<span class="font-italic">Keyword must be at least <strong>3 characters</strong>. </span> ';
      }

      if (this.search) {
        hint += ` No results matching "<strong>${this.search}</strong>". Press <strong>enter</strong> to create a new keyword. `;
      } else {
        hint += ' Start typing for keyword autocompletion.';
      }

      return hint.trim();
    },
    existingKeywordItems() {
      if (this.$store) {
        const getTag =
          this.$store.getters[`${METADATA_NAMESPACE}/existingKeywords`];
        const arrayFromTags = this.getTagName(getTag);
        return arrayFromTags;
      }

      return this.getTagName(this.existingKeywords);
    },
    genericTextAreaObject() {
      return {
        labelTextarea: this.labelsDescription.labelTextarea,
        textareaContent: this.description,
        isVerticalLayout: false,
        prependIcon: mdiText,
      };
    },
  },
  methods: {
    keywordsChanged() {
      this.$emit('save', {
        keywords: this.newDatasetInfo.keywords,
      });
    },
    setTitleInput(value) {
      this.newDatasetInfo.metadataTitle = value;

      this.$emit('validate', {
        metadataTitle: value,
      });
    },
    notifyTitleChange(value) {
      this.newDatasetInfo.metadataTitle = value;

      this.$emit('save', {
        metadataTitle: value,
      });
    },
    onDescriptionInput(value) {
      this.newDatasetInfo.metadataDescription = value;
      this.$emit('validate', {
        metadataDescription: value,
      });
    },
    onDescriptionChange(value) {
      this.newDatasetInfo.metadataDescription = value;
      this.$emit('save', {
        metadataDescription: value,
      });
    },
    blurOnEnterKey(keyboardEvent) {
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.target.blur();
      }
    },
    catchKeywordEntered(event) {
      if (event.key === 'Enter') {
        const enteredKeyword = event.target.value;

        if (this.isKeywordValid(enteredKeyword)) {
          this.catchKeywordClicked(enteredKeyword);
          this.keywordsChanged();
          // event.target.focus();
        }
      }
    },
    catchKeywordClicked(pickedKeyword) {
      // Use pickedKeyword to create pickedKeywordObj
      const pickedKeywordObj = {
        name: pickedKeyword.toUpperCase().trim(),
        color: getTagColor(categoryCards, pickedKeyword),
      };

      // Assign selectedKeywords to keywords concatenated with pickedKeywordObj

      const selectedKeywords = (this.keywordsField || []).concat([
        pickedKeywordObj,
      ]);

      this.newDatasetInfo.keywords = this.processValues(selectedKeywords);
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
            i--; // decrease to ensure not skipping the next entry because splice changes the index
          } else {
            valuesArray[i] = {
              name: valuesArray[i].toUpperCase().trim(),
              color: getTagColor(categoryCards, valuesArray[i]),
            };
          }
        }
      }

      // Remove duplicates from valuesArray
      valuesArray = [...new Set(valuesArray.map((a) => JSON.stringify(a)))].map(
        (a) => JSON.parse(a),
      );

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
      this.newDatasetInfo.keywords = this.processValues(localKeywords);
    },
    // Assign keywordCountEnough to true if keywordCount is greater than or equal to keywordsCountMin
    // Else assigns keywordCountEnough to false
    isEnoughKeywords() {
      const keywordCountEnough = this.keywordCount >= this.keywordsCountMin;

      if (!keywordCountEnough) {
        this.rulesKeywords = [
          `Please enter at least ${this.keywordsCountMin} keywords.`,
        ];
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
        this.keywordValidConcise =
          inputSplit.length <= this.keywordsListWordMax;
      }

      return this.keywordValidMin3Characters && this.keywordValidConcise;
    },

    getTagName(arr) {
      return arr?.map((item) => item.name);
    },

    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  data: () => ({
    mdiPaletteSwatch,
    mdiArrowDownDropCircleOutline,
    mdiBookOpenVariantOutline,
    search: '',
    keywordValidConcise: true,
    keywordValidMin3Characters: true,
    keywordCount: 0,
    rulesKeywords: [],
    newDatasetInfo: {
      metadataTitle: undefined,
      keywords: undefined,
      metadataDescription: undefined,
    },
    defaultUserEditMetadataConfig: {
      keywordsListWordMax: 2,
      keywordsCountMin: 5,
    },
    labelsKeywords: {
      title: 'Keywords',
      placeholder: 'Pick keywords from the list or type in a new keyword',
      cardInstructions1:
        'Enter at least 5 keywords. Click a keyword to select it, or type to search or create a new one.',
    },
    labelsDescription: {
      title: 'Description',
      descriptionInstructions:
        'Enter a description which helps other researchers to understand your data. Use <a href="https://www.markdownguide.org/cheat-sheet" target="_blank">markdown </a> to format the description and make it easier to read.',
    },
    labels: {
      stepTitle: 'Research Header Information',
      title: 'Title',
      labelTitle: 'Research Data Title',

      instructions:
        'The header is part of the main metadata information.' +
        'Together with the other information in the "Metadata" step, it represents the core information for your research dataset.',
      instructionsTitle:
        'Enter a title for your research dataset. Please make sure that title is meaningful and specific.',
      placeholderTitle: 'Enter the title for your research dataset',
      placeholderHeaderTitle: 'Your Metadata Title',
    },
  }),
  components: {
    MetadataDescription,
    MetadataHeader,
    TagChip,
    // BaseStatusLabelView,
    GenericTextareaPreviewLayout,
  },
};
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
