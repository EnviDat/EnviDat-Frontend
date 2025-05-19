<template>
  <v-card id="EditMetadataHeader" class="pa-0" elevation="0">
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="12">
          <MetadataHeader v-bind="metadataPreviewEntry" />
        </v-col>
        <v-col class="text-h5" cols="8">
          {{ labels.title }}
        </v-col>

        <v-col v-if="message" cols="4" class="pl-16">
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
        </v-col>
      </v-row>

      <v-row no-gutters class="pt-4">
        <v-col cols="12" class="text-body-1">
          {{ labels.instructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-text-field
            ref="metadataTitle"
            :id="METADATA_TITLE_PROPERTY"
            :label="labels.labelTitle"
            :readonly="isReadOnly(false)"
            :error-messages="validationErrors.metadataTitle"
            hide-details="auto"
            persistent-hint
            :hint="readOnlyHint(false)"
            :prepend-icon="mdiBookOpenVariantOutline"
            :placeholder="labels.placeholderTitle"
            :model-value="metadataTitleField"
            @keyup="blurOnEnterKey"
            @input="notifyPropertyChange($event.target.value)"
            @change="notifyPropertyChange($event.target.value)"
          />
        </v-col>
        <v-col cols="6">
          <v-row>
            <v-col class="text-body-1">
              <div>{{ labels.cardInstructions1 }}</div>
              <div>{{ labels.cardInstructions2 }}</div>
            </v-col>
          </v-row>
          <v-autocomplete
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
            :error-messages="validationErrors.keywords"
            @update:search="
              search = $event;
              isKeywordValid(search);
            "
            @keyup="blurOnEnterKey"
            @input="isEnoughKeywords()"
            @change="notifyKeywordsChange"
            @blur="saveChange()"
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
      </v-row>

      <v-row>
        <v-col>
          <GenericTextareaPreviewLayout
            v-bind="genericTextAreaObject"
            :textarea-content="metadataDescriptionField"
            :validationError="validationErrors.metadataDescription"
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
  </v-card>
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
  mdiAccount,
  mdiBookOpenVariantOutline,
  mdiEmail,
  mdiText,
  mdiPaletteSwatch,
  mdiArrowDownDropCircleOutline,
} from '@mdi/js';

import {
  METADATA_NAMESPACE,
  METADATA_UPDATE_EXISTING_TITLE,
} from '@/store/metadataMutationsConsts';

import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
// import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
// import ExpandableLayout from '@/components/Layouts/ExpandableLayout.vue';
import categoryCards from '@/store/categoryCards';

import { getTagColor } from '@/factories/keywordsFactory';

import {
  EDIT_METADATA_TITLE,
  EDIT_METADATA_TITLE_LABEL,
  EDIT_METADATA_URL_LABEL,
  EDIT_STEP_TITLE_MAIN_METADATA,
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
  EDIT_METADATA_KEYWORDS_TITLE,
  EDIT_METADATA_DESCRIPTION_TITLE,
} from '@/factories/metadataConsts';

// import { getMetadataUrlFromTitle } from '@/factories/mappingFactory';
import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';
// import { type } from '@amcharts/amcharts5';

export default {
  name: 'EditMetadataHeader',
  props: {
    metadataTitle: String,
    metadataDescription: String,
    // keywords: Array,
    validationErrors: {
      type: Object,
      default: () => {},
    },
    keywords: {
      type: Array,
      default: null,
    },
    // metadataTitle: {
    //   type: String,
    //   default: '',
    // },

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

  mounted() {
    console.log(this.viewModel);
  },

  computed: {
    keywordsCountMin() {
      return this.defaultUserEditMetadataConfig.keywordsCountMin;
    },
    keywordsListWordMax() {
      return this.defaultUserEditMetadataConfig.keywordsListWordMax;
    },
    // keywordsField: {
    //   get() {
    //     return this.previewKeywords.length > 0
    //       ? this.previewKeywords
    //       : this.keywords;
    //   },
    // },
    metadataTitleField() {
      return this.metadataTitle;
    },
    metadataDescriptionField() {
      return this.metadataDescription;
    },
    keywordsField: {
      get() {
        return this.previewKeywords.length
          ? this.previewKeywords
          : this.keywords;
      },
      set(v) {
        this.notifyKeywordsChange(v);
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
        hint += ` No results matching "<strong>${this.search}</strong>". Press <v-btn small variant="tonal" class="mx-1" text>enter</v-btn> to create a new keyword. `;
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
    // metadataTitleField: {
    //   get() {
    //     return this.previews[METADATA_TITLE_PROPERTY] !== null
    //       ? this.previews[METADATA_TITLE_PROPERTY]
    //       : this.metadataTitle;
    //   },
    // },
  },
  methods: {
    notifyKeywordsChange(val) {
      this.previewKeywords = this.processValues(val);
      this.$emit('save', { keywords: this.previewKeywords });
    },
    notifyPropertyChange(value) {
      const newHeaderInfo = {
        metadataTitle: value,
      };

      this.$emit('save', newHeaderInfo);
    },
    onDescriptionInput(val) {
      /* live preview se ti serve */
    },
    onDescriptionChange(val) {
      this.$emit('save', { metadataDescription: val }); // salva nel VM
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
      this.previewKeywords = this.processValues(localKeywords);
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
    notifyChange(value) {
      const mergedKeywordsField = [...this.keywordsField, ...value];
      this.previewKeywords = this.processValues(mergedKeywordsField);
    },
    setKeywords(property, value) {
      // const newKeywords = {
      //   ...this.$props,
      //   [property]: value,
      // };
      // setKEYWORDS here
      // eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
      //   object: EDITMETADATA_KEYWORDS,
      //   data: newKeywords,
      // });
    },
    getTagName(arr) {
      return arr.map((item) => item.name);
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
    search: '',
    keywordValidConcise: true,
    keywordValidMin3Characters: true,
    keywordCount: 0,
    rulesKeywords: [],
    mdiBookOpenVariantOutline,
    mdiAccount,
    mdiEmail,
    defaultUserEditMetadataConfig: {
      keywordsListWordMax: 2,
      keywordsCountMin: 5,
    },
    previewKeywords: [],
    authorIsPicked: false,
    authorPickerTouched: false,
    previews: {
      [METADATA_TITLE_PROPERTY]: null,
      [METADATA_URL_PROPERTY]: null,
      [METADATA_CONTACT_FIRSTNAME]: null,
      [METADATA_CONTACT_LASTNAME]: null,
      [METADATA_CONTACT_EMAIL]: null,
    },
    labelsKeywords: {
      title: EDIT_METADATA_KEYWORDS_TITLE,
      keywordsLabel: 'Keywords',
      placeholder: 'Pick keywords from the list or type in a new keyword',
      cardInstructions1: 'Please enter at least 5 keywords.',
      cardInstructions2:
        'To pick a keyword click into the list, you can start typing to search for a existing keywords.' +
        ' To create a new keyword type it and press enter.',
      previewText: 'Dataset entry preview',
    },
    labelsDescription: {
      cardTitle: EDIT_METADATA_DESCRIPTION_TITLE,
      labelTextarea: 'Research Data Description',
      descriptionInstructions:
        'Enter a description which helps other researchers to understand your data. Use <a href="https://www.markdownguide.org/cheat-sheet" target="_blank">markdown </a> to format the description and make it easier to read.',
      subtitlePreview: 'Description Preview',
    },
    labels: {
      title: EDIT_METADATA_TITLE,
      contactPerson: 'Contact Person',
      labelTitle: EDIT_METADATA_TITLE_LABEL,
      labelUrl: EDIT_METADATA_URL_LABEL,
      labelContactEmail: 'Contact Email',
      labelContactGivenName: 'Contact Given Name',
      labelContactSurname: 'Contact Surname',
      instructions:
        'The header is part of the main metadata information.' +
        ` Together with the other information in the "${EDIT_STEP_TITLE_MAIN_METADATA}" step, it represents the core information for your research dataset.`,
      instructions2:
        'Enter a title for your research dataset. Please make sure that title is meaningful and specific.',
      authorInstructions:
        'Enter an email address or pick a user as the contact person for this dataset.',
      authorOr: '<strong>Or</strong> pick <br /> an author',
      authorOr2: '<strong>Or</strong> pick an author',
      authorAutoComplete:
        'If an author is picked the name is <strong>autocompleted</strong> otherwise please enter it!',
      placeholderTitle: 'Enter the title for your research dataset',
      placeholderUrl: 'Change the url for your dataset',
      placeholderHeaderTitle: 'Your Metadata Title',
      placeholderContactEmail: 'Enter contact email address',
      placeholderContactGivenName: 'Enter contact given (first) name',
      placeholderContactSurname: 'Enter contact surname name',
      previewText: 'Metadata Header Preview',
      authorDropdown:
        'Click here and start typing to select an existing EnviDat author',
      authorPickHint:
        'Start typing the name in the text field to search for an author.',
    },
    // contactValidationProperties: [
    //   METADATA_CONTACT_EMAIL,
    //   METADATA_CONTACT_FIRSTNAME,
    //   METADATA_CONTACT_LASTNAME,
    // ],
    // validationErrors: {
    //   [METADATA_TITLE_PROPERTY]: null,
    //   [METADATA_URL_PROPERTY]: null,
    //   [METADATA_CONTACT_FIRSTNAME]: null,
    //   [METADATA_CONTACT_LASTNAME]: null,
    //   [METADATA_CONTACT_EMAIL]: null,
    // },
    activeElements: {
      [METADATA_CONTACT_FIRSTNAME]: false,
      [METADATA_CONTACT_LASTNAME]: false,
      [METADATA_CONTACT_EMAIL]: false,
    },
    METADATA_TITLE_PROPERTY,
    METADATA_URL_PROPERTY,
    METADATA_CONTACT_EMAIL,
    METADATA_CONTACT_FIRSTNAME,
    METADATA_CONTACT_LASTNAME,
  }),
  components: {
    MetadataHeader,
    // BaseUserPicker,
    BaseStatusLabelView,
    GenericTextareaPreviewLayout,
    // ExpandableLayout,
  },
};
</script>

<style scoped>
.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}
</style>
