<template>
  <v-card
    id="EditMetadataHeader"
    class="pa-0"
    elevation="0"
    :loading="loadingColor"
  >
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
            :readonly="isReadOnly(METADATA_TITLE_PROPERTY)"
            hide-details="auto"
            persistent-hint
            :hint="readOnlyHint(METADATA_TITLE_PROPERTY)"
            :prepend-icon="mdiBookOpenVariantOutline"
            :error-messages="validationErrors[METADATA_TITLE_PROPERTY]"
            :placeholder="labels.placeholderTitle"
            :model-value="metadataTitleField"
            @keyup="blurOnEnterKey"
            @input="
              changePropertyForPreview(
                METADATA_TITLE_PROPERTY,
                $event.target.value,
              )
            "
            @change="
              notifyPropertyChange(METADATA_TITLE_PROPERTY, $event.target.value)
            "
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
            @change="notifyChange($event)"
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
            :validationError="validationErrors[editingProperty]"
            :readonly="isReadOnly(editingProperty)"
            :hint="readOnlyHint(editingProperty)"
            @inputedText="catchInputedText($event)"
            @changedText="catchChangedText($event)"
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
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_KEYWORDS,
  eventBus,
} from '@/factories/eventBus';

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

import { enhanceTitleImg } from '@/factories/metaDataFactory';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValid,
} from '@/factories/userEditingValidations';
import {
  createContact,
  creationContactFromAuthor,
  getArrayOfFullNames,
  getAuthorByEmail,
  getAuthorByName,
  getAuthorName,
} from '@/factories/authorFactory';
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

import { getMetadataUrlFromTitle } from '@/factories/mappingFactory';
import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';

export default {
  name: 'EditMetadataHeader',
  props: {
    keywords: {
      type: Array,
      default: null,
    },
    authors: {
      type: Array,
      default: () => [],
    },
    existingEnviDatUsers: {
      type: Array,
      default: () => [],
    },
    existingAuthors: {
      type: Array,
      default: () => [],
    },
    metadataTitle: {
      type: String,
      default: '',
    },
    contactGivenName: {
      type: String,
      default: '',
    },
    contactSurname: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    metadataUrl: {
      type: String,
      default: null,
    },
    pickedUser: {
      type: Array,
      default: () => [],
    },
    organization: {
      type: String,
      default: undefined,
    },
    organizationTooltip: {
      type: String,
      default: undefined,
    },
    doi: {
      type: String,
      default: '',
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
    userEditMetadataConfig() {
      if (!this.$store) {
        return this.defaultUserEditMetadataConfig;
      }

      return (
        this.config?.userEditMetadataConfig ||
        this.defaultUserEditMetadataConfig
      );
    },
    keywordsCountMin() {
      return this.userEditMetadataConfig.keywordsCountMin;
    },
    keywordsListWordMax() {
      return this.userEditMetadataConfig.keywordsListWordMax;
    },
    keywordsField: {
      get() {
        return this.previewKeywords.length > 0
          ? this.previewKeywords
          : this.keywords;
      },
    },
    metadataPreviewEntry() {
      const previewEntry = {
        title: this.metadataCardTitle,
        tags: this.keywordsField,
        subtitle: this.metadataCardSubtitle,
      };

      if (this.$store) {
        enhanceTitleImg(previewEntry);
      }

      return previewEntry;
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
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    genericTextAreaObject() {
      return {
        labelTextarea: this.labelsDescription.labelTextarea,
        textareaContent: this.description,
        isVerticalLayout: false,
        prependIcon: mdiText,
      };
    },
    metadataTitleField: {
      get() {
        return this.previews[METADATA_TITLE_PROPERTY] !== null
          ? this.previews[METADATA_TITLE_PROPERTY]
          : this.metadataTitle;
      },
    },
    contactGivenNameField: {
      get() {
        return this.previews[METADATA_CONTACT_FIRSTNAME] !== null
          ? this.previews[METADATA_CONTACT_FIRSTNAME]
          : this.contactGivenName;
      },
    },
    contactSurnameField: {
      get() {
        return this.previews[METADATA_CONTACT_LASTNAME] !== null
          ? this.previews[METADATA_CONTACT_LASTNAME]
          : this.contactSurname;
      },
    },
    contactEmailField: {
      get() {
        return this.previews[METADATA_CONTACT_EMAIL] !== null
          ? this.previews[METADATA_CONTACT_EMAIL]
          : this.contactEmail;
      },
    },
    metadataUrlField: {
      get() {
        return this.previews[METADATA_URL_PROPERTY] !== null
          ? this.previews[METADATA_URL_PROPERTY]
          : this.metadataUrl;
      },
    },
    preselectAuthorNames() {
      const author = getAuthorByEmail(
        this.contactEmailField,
        this.existingAuthorsWrap,
      );
      const fullName = getAuthorName(author);

      return fullName ? [fullName] : [];
    },
    existingAuthorsWrap() {
      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingAuthors`];
      }

      return this.existingAuthors;
    },
    fullNameUsers() {
      const localAuthors = [...this.existingAuthorsWrap];
      return getArrayOfFullNames(localAuthors);
    },
    metadataPreviewEntryAuthor() {
      const fullName = getAuthorName({
        firstName: this.contactGivenNameField,
        lastName: this.contactSurnameField,
      });

      const previewEntry = {
        [METADATA_TITLE_PROPERTY]:
          this.metadataTitleField || this.labels.placeholderHeaderTitle,
        title: this.metadataTitleField || this.labels.placeholderHeaderTitle, // is needed for the enhanceTitleImg
        showCloseButton: false,
        contactName: fullName,
        [METADATA_CONTACT_EMAIL]: this.contactEmailField,
        doi: this.doi,
        organization: this.organization,
        organizationTooltip: this.organizationTooltip,
        tags: this.keywords,
        authors: this.authors,
      };

      enhanceTitleImg(previewEntry);

      return previewEntry;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_MAIN_HEADER);
    },
    contactInfoReadOnly() {
      return (
        (this.authorPickerTouched && this.authorIsPicked) ||
        (!this.authorPickerTouched && this.authorPickerFoundAuthor)
      );
    },
    authorPickerFoundAuthor() {
      if (
        this.preselectAuthorNames?.length <= 0 ||
        this.fullNameUsers?.length <= 0
      ) {
        return false;
      }

      const matches = this.fullNameUsers.filter(
        (fullName) => fullName === this.preselectAuthorNames[0],
      );
      return matches.length > 0;
    },
    anyUserElementsActive() {
      return (
        this.activeElements[METADATA_CONTACT_EMAIL] ||
        this.activeElements[METADATA_CONTACT_FIRSTNAME] ||
        this.activeElements[METADATA_CONTACT_LASTNAME]
      );
    },
    anyPreviewsChanged() {
      return (
        this.previews[METADATA_CONTACT_FIRSTNAME] !== null ||
        this.previews[METADATA_CONTACT_LASTNAME] !== null ||
        this.previews[METADATA_CONTACT_EMAIL] !== null
      );
    },
  },
  methods: {
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
      const newKeywords = {
        ...this.$props,
        [property]: value,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_KEYWORDS,
        data: newKeywords,
      });
    },
    getTagName(arr) {
      return arr.map((item) => item.name);
    },
    blurOnEnterKeyKeywords(keyboardEvent) {
      if (keyboardEvent.key === 'Enter' && keyboardEvent.target.value === '') {
        keyboardEvent.target.blur();
      }
    },
    catchInputedText(value) {
      this.previewText = value;
      this.validateProperty(this.editingProperty, value);
    },
    catchChangedText(value) {
      if (this.validateProperty(this.editingProperty, value)) {
        this.setDescriptionText(value);
      }
    },
    isContactPropertyReadOnly(property) {
      return this.contactInfoReadOnly || this.isReadOnly(property);
    },
    contactPropertyHint(property) {
      if (this.contactInfoReadOnly) {
        return 'Not editable, the contact is defined in the drop down';
      }

      return this.readOnlyHint(property);
    },
    clearPreviews() {
      this.previews[METADATA_CONTACT_FIRSTNAME] = null;
      this.previews[METADATA_CONTACT_LASTNAME] = null;
      this.previews[METADATA_CONTACT_EMAIL] = null;
      this.previews[METADATA_TITLE_PROPERTY] = null;
      this.previews[METADATA_URL_PROPERTY] = null;
    },
    // Validate contact author properties by calling isFieldValid()
    // Returns true if all properties are valid, else returns false
    validateAuthor(contactObject) {
      if (!contactObject) {
        return false;
      }

      const properties = [
        METADATA_CONTACT_EMAIL,
        METADATA_CONTACT_FIRSTNAME,
        METADATA_CONTACT_LASTNAME,
      ];

      // Validate fields corresponding to properties
      for (let i = 0; i < properties.length; i++) {
        isFieldValid(
          properties[i],
          contactObject[properties[i]],
          this.validations,
          this.validationErrors,
        );
      }

      // Return false if any of the properties have a validation error
      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        if (this.validationErrors[prop]) {
          return false;
        }
      }

      return true;
    },
    focusIn(event) {
      this.markPropertyActive(event.target, true);
    },
    focusOut(property, event) {
      this.markPropertyActive(event.target, false);
      this.markPropertyActive(event.relatedTarget, true);
      // this.delayedNotifyChange(property, event.target.value);
      this.notifyContactChange(property, event.target.value);
    },
    markPropertyActive(toElement, editing) {
      const toId = toElement?.id || null;
      if (toId) {
        this.activeElements[toId] = editing;
      }
    },
    changePropertyForPreview(property, value) {
      this.previews[property] = value;
      const valid = this.validateProperty(property, value);

      if (this.$store) {
        // do it if the store is available otherwise in the storybook context the component breaks
        // pass the value of the title to preview changes
        this.$store.commit(
          `${METADATA_NAMESPACE}/${METADATA_UPDATE_EXISTING_TITLE}`,
          value,
        );
      }

      if (valid && property === METADATA_TITLE_PROPERTY && !this.metadataUrl) {
        this.previews[METADATA_URL_PROPERTY] = getMetadataUrlFromTitle(value);
      }
    },
    validateProperty(property, value) {
      return isFieldValid(
        property,
        value,
        this.validations,
        this.validationErrors,
      );
    },
    catchPickerAuthorChange(pickedAuthorName, hasAuthor) {
      this.authorPickerTouched = true;
      this.authorIsPicked = hasAuthor;

      if (this.authorIsPicked) {
        const author = getAuthorByName(
          pickedAuthorName,
          this.existingAuthorsWrap,
        );
        const contactObject = creationContactFromAuthor(author);

        this.previews[METADATA_CONTACT_FIRSTNAME] =
          contactObject[METADATA_CONTACT_FIRSTNAME];
        this.previews[METADATA_CONTACT_LASTNAME] =
          contactObject[METADATA_CONTACT_LASTNAME];
        this.previews[METADATA_CONTACT_EMAIL] =
          contactObject[METADATA_CONTACT_EMAIL];

        if (this.validateAuthor(contactObject)) {
          this.setFullContactInfos(contactObject);
        }
      } else {
        // has to be an empty string here otherwise the old value (via $props)
        // would be shown
        this.previews[METADATA_CONTACT_FIRSTNAME] = '';
        this.previews[METADATA_CONTACT_LASTNAME] = '';
        this.previews[METADATA_CONTACT_EMAIL] = '';
      }
    },
    notifyPropertyChange(property, value) {
      if (this.previews[property] === null) {
        return;
      }

      if (this.validateProperty(property, value)) {
        this.setHeaderInfo(property, value);
      }
    },
    notifyContactChange(property, value) {
      if (this.anyUserElementsActive) {
        return;
      }

      if (!this.anyPreviewsChanged) {
        return;
      }

      // default to filling all the infos from the text-field input
      let contactObject = createContact(
        this.contactGivenNameField,
        this.contactSurnameField,
        this.contactEmailField,
      );

      if (property === METADATA_CONTACT_EMAIL) {
        if (
          isFieldValid(property, value, this.validations, this.validationErrors)
        ) {
          // autocomplete author
          const author = getAuthorByEmail(value, this.existingAuthorsWrap);

          const autoCompletedContactObject = creationContactFromAuthor(author);

          if (autoCompletedContactObject) {
            this.previews[METADATA_CONTACT_FIRSTNAME] =
              autoCompletedContactObject[METADATA_CONTACT_FIRSTNAME];
            this.previews[METADATA_CONTACT_LASTNAME] =
              autoCompletedContactObject[METADATA_CONTACT_LASTNAME];

            // overwrite any infos from the text-fields with the author infos
            // from the autocomplete
            contactObject = autoCompletedContactObject;

            // this makes the text-fields readonly again
            this.authorPickerTouched = false;
          }
        }
      }

      // store all the contact infos because notifyChanges is only called
      // when the user focus leaves any of the fields, therefore all changes
      // must be stored

      if (
        isObjectValid(
          this.contactValidationProperties,
          contactObject,
          this.validations,
          this.validationErrors,
        )
      ) {
        this.setFullContactInfos(contactObject);
      }
    },
    setFullContactInfos(contactObject) {
      const newHeaderInfo = {
        ...this.$props,
        ...contactObject,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });
    },
    setHeaderInfo(property, value) {
      let newHeaderInfo = {
        ...this.$props,
        [property]: value,
      };

      if (
        property === METADATA_TITLE_PROPERTY &&
        !this.metadataUrl &&
        this.metadataUrlField
      ) {
        // in the case of typing in the title for the first time, make sure
        // to store the url as well
        newHeaderInfo = {
          ...newHeaderInfo,
          [METADATA_URL_PROPERTY]: this.metadataUrlField,
        };
      }

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });
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
    contactValidationProperties: [
      METADATA_CONTACT_EMAIL,
      METADATA_CONTACT_FIRSTNAME,
      METADATA_CONTACT_LASTNAME,
    ],
    validationErrors: {
      [METADATA_TITLE_PROPERTY]: null,
      [METADATA_URL_PROPERTY]: null,
      [METADATA_CONTACT_FIRSTNAME]: null,
      [METADATA_CONTACT_LASTNAME]: null,
      [METADATA_CONTACT_EMAIL]: null,
    },
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
