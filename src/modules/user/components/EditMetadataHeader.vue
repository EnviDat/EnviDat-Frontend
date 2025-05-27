<template>
  <v-card id="EditMetadataHeader"
          class="pa-0"
          :loading="loadingColor">

    <v-container fluid
                 class="pa-4">

      <v-row>

        <v-col class="text-h5" cols="8">
          {{ labels.title }}
        </v-col>

        <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView status="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails"/>
        </v-col>
        <v-col v-if="error" cols="4" class="pl-16">

          <BaseStatusLabelView status="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails"/>
        </v-col>

      </v-row>


      <v-row no-gutters
             class="pt-4">
        <v-col cols="12"
               class="text-body-1">
          {{ labels.instructions }}
        </v-col>

      </v-row>

      <v-row>

        <v-col >

          <v-text-field ref="metadataTitle"
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
                        @input="changePropertyForPreview(METADATA_TITLE_PROPERTY, $event.target.value)"
                        @change="notifyPropertyChange(METADATA_TITLE_PROPERTY, $event.target.value)"
          />

        </v-col>

      </v-row>


      <v-row>
        <v-col cols="12"
               lg="6">

          <v-row>
            <v-col class="text-h6 pb-0">
              {{ labels.contactPerson }}
            </v-col>
          </v-row>


          <v-row>
            <v-col class="text-body-1">
              {{ labels.authorInstructions }}
            </v-col>
          </v-row>

          <v-row >

            <v-col cols="12"
                   sm="6"
                   class="pt-5"
            >

              <v-text-field ref="contactEmail"
                            :id="METADATA_CONTACT_EMAIL"
                            :label="labels.labelContactEmail"
                            :error-messages="validationErrors[METADATA_CONTACT_EMAIL]"
                            :readonly="isContactPropertyReadOnly(METADATA_CONTACT_EMAIL)"
                            hide-details="auto"
                            persistent-hint
                            :hint="contactPropertyHint(METADATA_CONTACT_EMAIL)"
                            :prepend-icon="mdiEmail"
                            :placeholder="labels.placeholderContactEmail"
                            :model-value="contactEmailField"
                            @keyup="blurOnEnterKey"
                            @focusin="focusIn($event)"
                            @focusout="focusOut(METADATA_CONTACT_EMAIL, $event)"
                            @input="changePropertyForPreview(METADATA_CONTACT_EMAIL, $event.target.value)"
              />

            </v-col>

            <v-col cols="12"
                   sm="6"
                   class="pl-sm-4"
            >

              <BaseUserPicker :users="fullNameUsers"
                              :preSelected="preselectAuthorNames"
                              :hint="labels.authorPickHint"
                              @removedUsers="catchPickerAuthorChange($event, false)"
                              @pickedUsers="catchPickerAuthorChange($event, true)"/>
            </v-col>

          </v-row>

          <v-row>

            <v-col class="text-body-1"
                   v-html="labels.authorAutoComplete">
            </v-col>
          </v-row>

          <v-row >

            <v-col cols="12"
                   sm="6">

              <v-text-field ref="contactFirstName"
                            :id="METADATA_CONTACT_FIRSTNAME"
                            :label="labels.labelContactFirstName"
                            :error-messages="validationErrors[METADATA_CONTACT_FIRSTNAME]"
                            :readonly="isContactPropertyReadOnly(METADATA_CONTACT_FIRSTNAME)"
                            hide-details="auto"
                            persistent-hint
                            :hint="contactPropertyHint(METADATA_CONTACT_FIRSTNAME)"
                            :prepend-icon="mdiAccount"
                            :placeholder="labels.placeholderContactFirstName"
                            :model-value="contactFirstNameField"
                            @keyup="blurOnEnterKey"
                            @focusin="focusIn($event)"
                            @focusout="focusOut(METADATA_CONTACT_FIRSTNAME, $event)"
                            @input="changePropertyForPreview(METADATA_CONTACT_FIRSTNAME, $event.target.value)"
              />

            </v-col>

            <v-col cols="12"
                   sm="6"
                   class="pl-sm-4">

              <v-text-field ref="contactLastName"
                            :id="METADATA_CONTACT_LASTNAME"
                            :label="labels.labelContactLastName"
                            :error-messages="validationErrors[METADATA_CONTACT_LASTNAME]"
                            :readonly="isContactPropertyReadOnly(METADATA_CONTACT_LASTNAME)"
                            hide-details="auto"
                            persistent-hint
                            :hint="contactPropertyHint(METADATA_CONTACT_LASTNAME)"
                            :prepend-icon="mdiAccount"
                            :placeholder="labels.placeholderContactLastName"
                            :model-value="contactLastNameField"
                            @keyup="blurOnEnterKey"
                            @focusin="focusIn($event)"
                            @focusout="focusOut(METADATA_CONTACT_LASTNAME, $event)"
                            @input="changePropertyForPreview(METADATA_CONTACT_LASTNAME, $event.target.value)"
              />

            </v-col>

          </v-row>

        </v-col>

        <v-col v-if="$vuetify.display.lgAndUp"
               cols="12"
               sm="6"
        >
          <v-row>
            <v-col cols="12" class="text-subtitle-1">
              {{ labels.previewText }}
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="12">
              <MetadataHeader v-bind="metadataPreviewEntry"/>
            </v-col>
          </v-row>

        </v-col>
      </v-row>

      <v-row dense >
        <v-col cols="12" >

          <ExpandableLayout statusText="Advanced Header info"
                            isFlat>

            <v-text-field ref="metadataUrl"
                          :id="METADATA_URL_PROPERTY"
                          :label="labels.labelUrl"
                          :readonly="isReadOnly(METADATA_URL_PROPERTY)"
                          hide-details="auto"
                          persistent-hint
                          :hint="readOnlyHint(METADATA_URL_PROPERTY)"
                          :prepend-icon="mdiBookOpenVariantOutline"
                          :error-messages="validationErrors[METADATA_URL_PROPERTY]"
                          :placeholder="labels.placeholderUrl"
                          :model-value="metadataUrlField"
                          @keyup="blurOnEnterKey"
                          @click.stop
                          @input="changePropertyForPreview(METADATA_URL_PROPERTY, $event.target.value)"
                          @change="notifyPropertyChange(METADATA_URL_PROPERTY, $event.target.value)"
            />
          </ExpandableLayout>

        </v-col>
      </v-row>

      <v-row v-if="$vuetify.display.mdAndDown">
        <v-col cols="12" class="text-subtitle-1">
          {{ labels.previewText }}
        </v-col>

        <v-col cols="12">
          <MetadataHeader v-bind="metadataPreviewEntry"/>
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
import {mdiAccount, mdiBookOpenVariantOutline, mdiEmail} from '@mdi/js';
import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import { METADATA_NAMESPACE, METADATA_UPDATE_EXISTING_TITLE } from '@/store/metadataMutationsConsts';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import ExpandableLayout from '@/components/Layouts/ExpandableLayout.vue';

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
    contactFirstName: {
      type: String,
      default: '',
    },
    contactLastName: {
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
/*
    validationErrors: {
      type: Object,
      default: () => {},
    },
*/
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  emits: ['save'],
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    metadataTitleField: {
      get() {
        return this.previews[METADATA_TITLE_PROPERTY] !== null ? this.previews[METADATA_TITLE_PROPERTY] : this.metadataTitle;
      },
    },
    contactFirstNameField: {
      get() {
        return this.previews[METADATA_CONTACT_FIRSTNAME] !== null ? this.previews[METADATA_CONTACT_FIRSTNAME] : this.contactFirstName;
      },
    },
    contactLastNameField: {
      get() {
        return this.previews[METADATA_CONTACT_LASTNAME] !== null ? this.previews[METADATA_CONTACT_LASTNAME] : this.contactLastName;
      },
    },
    contactEmailField: {
      get() {
        return this.previews[METADATA_CONTACT_EMAIL] !== null ? this.previews[METADATA_CONTACT_EMAIL] : this.contactEmail;
      },
    },
    metadataUrlField: {
      get() {
        return this.previews[METADATA_URL_PROPERTY] !== null ? this.previews[METADATA_URL_PROPERTY] : this.metadataUrl;
      },
    },
    preselectAuthorNames() {
      const author = getAuthorByEmail(this.contactEmailField, this.existingAuthorsWrap);
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
    metadataPreviewEntry() {

      const fullName = getAuthorName({
        firstName: this.contactFirstNameField,
        lastName: this.contactLastNameField,
      });

      const previewEntry = {
        [METADATA_TITLE_PROPERTY]: this.metadataTitleField || this.labels.placeholderHeaderTitle,
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
      return (this.authorPickerTouched && this.authorIsPicked) || (!this.authorPickerTouched && this.authorPickerFoundAuthor);
    },
    authorPickerFoundAuthor() {
      if (this.preselectAuthorNames?.length <= 0 || this.fullNameUsers?.length <= 0) {
        return false;
      }

      const matches = this.fullNameUsers.filter(fullName => fullName === this.preselectAuthorNames[0]);
      return matches.length > 0;
    },
    anyUserElementsActive() {
      return this.activeElements[METADATA_CONTACT_EMAIL]
        || this.activeElements[METADATA_CONTACT_FIRSTNAME]
        || this.activeElements[METADATA_CONTACT_LASTNAME];
    },
    anyPreviewsChanged() {
      return this.previews[METADATA_CONTACT_FIRSTNAME] !== null
        || this.previews[METADATA_CONTACT_LASTNAME] !== null
        || this.previews[METADATA_CONTACT_EMAIL] !== null;
    },
  },
  methods: {
    blurOnEnterKey(keyboardEvent) {
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.target.blur();
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

      const properties = [METADATA_CONTACT_EMAIL, METADATA_CONTACT_FIRSTNAME, METADATA_CONTACT_LASTNAME];

      // Validate fields corresponding to properties
      for (let i = 0; i < properties.length; i++) {
        isFieldValid(properties[i], contactObject[properties[i]], this.validations, this.validationErrors);
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
      return isFieldValid(property, value, this.validations, this.validationErrors);
    },
    catchPickerAuthorChange(pickedAuthorName, hasAuthor) {

      this.authorPickerTouched = true;
      this.authorIsPicked = hasAuthor;

      if (this.authorIsPicked) {
        const author = getAuthorByName(pickedAuthorName, this.existingAuthorsWrap);
        const contactObject = creationContactFromAuthor(author);

        this.previews[METADATA_CONTACT_FIRSTNAME] = contactObject[METADATA_CONTACT_FIRSTNAME];
        this.previews[METADATA_CONTACT_LASTNAME] = contactObject[METADATA_CONTACT_LASTNAME];
        this.previews[METADATA_CONTACT_EMAIL] = contactObject[METADATA_CONTACT_EMAIL];

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
      if (this.previews[property] === null){
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
      let contactObject = createContact(this.contactEmailField, this.contactFirstNameField, this.contactLastNameField);

      if (property === METADATA_CONTACT_EMAIL) {
        if (isFieldValid(property, value, this.validations, this.validationErrors)) {

          // autocomplete author
          const author = getAuthorByEmail(value, this.existingAuthorsWrap);

          const autoCompletedContactObject = creationContactFromAuthor(author);

          if (autoCompletedContactObject) {
            this.previews[METADATA_CONTACT_FIRSTNAME] = autoCompletedContactObject[METADATA_CONTACT_FIRSTNAME];
            this.previews[METADATA_CONTACT_LASTNAME] = autoCompletedContactObject[METADATA_CONTACT_LASTNAME];

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

      if (isObjectValid(this.contactValidationProperties, contactObject, this.validations, this.validationErrors)) {
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

      this.$emit('save', newHeaderInfo);
    },
    setHeaderInfo(property, value) {

      let newHeaderInfo = {
        ...this.$props,
        [property]: value,
      };

      if (property === METADATA_TITLE_PROPERTY && !this.metadataUrl && this.metadataUrlField) {
        // in the case of typing in the title for the first time, make sure
        // to store the url as well
        newHeaderInfo = {
          ...newHeaderInfo,
          [METADATA_URL_PROPERTY]: this.metadataUrlField,
        }
      }

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });

      this.$emit('save', newHeaderInfo);
    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  data: () => ({
    mdiBookOpenVariantOutline,
    mdiAccount,
    mdiEmail,
    authorIsPicked: false,
    authorPickerTouched: false,
    previews: {
      [METADATA_TITLE_PROPERTY]: null,
      [METADATA_URL_PROPERTY]: null,
      [METADATA_CONTACT_FIRSTNAME]: null,
      [METADATA_CONTACT_LASTNAME]: null,
      [METADATA_CONTACT_EMAIL]: null,
    },
    labels: {
      title: EDIT_METADATA_TITLE,
      contactPerson: 'Contact Person',
      labelTitle: EDIT_METADATA_TITLE_LABEL,
      labelUrl: EDIT_METADATA_URL_LABEL,
      labelContactEmail: 'Contact Email',
      labelContactFirstName: 'Contact First Name',
      labelContactLastName: 'Contact Last Name',
      instructions: 'The header is part of the main metadata information.' +
        ` Together with the other information in the "${EDIT_STEP_TITLE_MAIN_METADATA}" step, it represents the core information for your research dataset.`,
      instructions2: 'Enter a title for your research dataset. Please make sure that title is meaningful and specific.',
      authorInstructions: 'Enter an email address or pick a user as the contact person for this dataset.',
      authorOr: '<strong>Or</strong> pick <br /> an author',
      authorOr2: '<strong>Or</strong> pick an author',
      authorAutoComplete: 'If an author is picked the name is <strong>autocompleted</strong> otherwise please enter it!',
      placeholderTitle: 'Enter the title for your research dataset',
      placeholderUrl: 'Change the url for your dataset',
      placeholderHeaderTitle: 'Your Metadata Title',
      placeholderContactEmail: 'Enter contact email address',
      placeholderContactFirstName: 'Enter contact first name',
      placeholderContactLastName: 'Enter contact last name',
      previewText: 'Metadata Header Preview',
      authorDropdown: 'Click here and start typing to select an existing EnviDat author',
      authorPickHint: 'Start typing the name in the text field to search for an author.',
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
    BaseUserPicker,
    BaseStatusLabelView,
    ExpandableLayout,
  },
};
</script>

<style scoped>

.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}

</style>
