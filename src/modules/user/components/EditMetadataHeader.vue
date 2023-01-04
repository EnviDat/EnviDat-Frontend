<template>
  <v-card id="EditMetadataHeader"
          class="pa-0"
          :loading="loading">

    <v-container fluid
                 class="pa-4 fill-height">

      <template v-slot:progress>
        <v-progress-linear color="primary"
                           indeterminate/>
      </template>

      <v-row>

        <v-col class="text-h5" cols="8">
          {{ labels.title }}
        </v-col>

        <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView statusIcon="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails"/>
        </v-col>
        <v-col v-if="error" cols="4" class="pl-16">

          <BaseStatusLabelView statusIcon="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails"/>
        </v-col>

      </v-row>


      <v-row>
        <v-col class="text-body-1 pb-0">
          {{ labels.instructions }}
        </v-col>
      </v-row>


      <v-row>
        <v-col class="text-body-1">
          {{ labels.instructions2 }}
        </v-col>
      </v-row>

      <v-row>

        <v-col cols="8" class="pb-0">

          <v-text-field ref="metadataTitle"
                        :label="labels.labelTitle"
                        outlined
                        :readonly="mixinMethods_isFieldReadOnly('metadataTitle')"
                        :hint="mixinMethods_readOnlyHint('metadataTitle')"
                        prepend-icon="import_contacts"
                        :error-messages="validationErrors.metadataTitle"
                        :placeholder="labels.placeholderTitle"
                        :value="metadataTitleField"
                        @input="changeProperty('metadataTitle', $event)"
                        @change="notifyTitleChange('metadataTitle', $event)"
          />

        </v-col>

      </v-row>


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


      <v-row dense
             class="pt-2">
        <v-col>

          <v-text-field ref="contactEmail"
                        id="contactEmail"
                        :label="labels.labelContactEmail"
                        outlined
                        :error-messages="validationErrors.contactEmail"
                        :readonly="isContactPropertyReadOnly('contactEmail')"
                        :hint="contactPropertyHint('contactEmail')"
                        prepend-icon="email"
                        :placeholder="labels.placeholderContactEmail"
                        :value="contactEmailField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('contactEmail', $event)"
                        @input="changeProperty('contactEmail', $event)"
                        />

        </v-col>

        <v-col class="shrink px-4 text-body-1 "
               style="text-align: center;"
               cols="2"
               v-html="labels.authorOr">
        </v-col>

        <v-col>

          <BaseUserPicker :users="fullNameUsers"
                          :preSelected="preselectAuthorNames"
                          @removedUsers="catchPickerAuthorChange($event, false)"
                          @pickedUsers="catchPickerAuthorChange($event, true)"/>
        </v-col>

      </v-row>

      <v-row dense>

        <v-col class=" pl-10 text-body-1"
               v-html="labels.authorAutoComplete">
        </v-col>
      </v-row>

      <v-row dense
             class="pt-2 pl-10">

        <v-col>

          <v-text-field ref="contactGivenName"
                        id="contactGivenName"
                        :label="labels.labelContactGivenName"
                        outlined
                        :error-messages="validationErrors.contactGivenName"
                        :readonly="isContactPropertyReadOnly('contactGivenName')"
                        :hint="contactPropertyHint('contactGivenName')"
                        prepend-icon="person"
                        :placeholder="labels.placeholderContactGivenName"
                        :value="contactGivenNameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('contactGivenName', $event)"
                        @input="changeProperty('contactGivenName', $event)"
                        />

        </v-col>

        <v-col class="pl-4">

          <v-text-field ref="contactSurname"
                        id="contactSurname"
                        :label="labels.labelContactSurname"
                        outlined
                        :error-messages="validationErrors.contactSurname"
                        :readonly="isContactPropertyReadOnly('contactSurname')"
                        :hint="contactPropertyHint('contactSurname')"
                        prepend-icon="person"
                        :placeholder="labels.placeholderContactSurname"
                        :value="contactSurnameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('contactSurname', $event)"
                        @input="changeProperty('contactSurname', $event)"
                        />

        </v-col>

      </v-row>


      <v-row>
        <v-col cols="12" class="text-subtitle-1">
          {{ labels.previewText }}
        </v-col>
      </v-row>

      <v-row>
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
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-11-23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader.vue';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';
import { enhanceTitleImg } from '@/factories/metaDataFactory';

import {
  getValidationMetadataEditingObject,
  isFieldValid, isObjectValid,
} from '@/factories/userEditingValidations';
import { getArrayOfFullNames, getAuthorName } from '@/factories/authorFactory';
import { EDIT_METADATA_MAIN_TITLE, EDIT_STEP_TITLE_MAIN_METADATA } from '@/factories/metadataConsts';


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
    pickedUser: {
      type: Array,
      default: () => [],
    },
    dataLicense: {
      type: String,
      default: () => '',
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
    metadataTitleField: {
      get() {
        return this.previews.metadataTitle !== null ? this.previews.metadataTitle : this.metadataTitle;
      },
    },
    contactGivenNameField: {
      get() {
        return this.previews.contactGivenName !== null ? this.previews.contactGivenName : this.contactGivenName;
      },
    },
    contactSurnameField: {
      get() {
        return this.previews.contactSurname !== null ? this.previews.contactSurname : this.contactSurname;
      },
    },
    contactEmailField: {
      get() {
        return this.previews.contactEmail !== null ? this.previews.contactEmail : this.contactEmail;
      },
    },
    preselectAuthorNames() {
      const author = this.getAuthorByEmail(this.contactEmailField);
      const fullName = this.getFullName(author);

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

      const doiIcon = this.mixinMethods_getIcon('doi') || '';
      const contactIcon = this.mixinMethods_getIcon('contact2') || this.iconName;
      const mailIcon = this.mixinMethods_getIcon('mail') || this.iconMail;
      const licenseIcon = this.mixinMethods_getIcon('license') || '';

      const fullName = this.getFullName({
        given_name: this.contactGivenNameField,
        name: this.contactSurnameField,
      });

      const previewEntry = {
        metadataTitle: this.metadataTitleField || this.labels.placeholderHeaderTitle,
        title: this.metadataTitleField || this.labels.placeholderHeaderTitle, // is needed for the enhanceTitleImg
        showCloseButton: false,
        contactName: fullName,
        contactIcon,
        contactEmail: this.contactEmailField,
        mailIcon,
        doi: this.doi,
        doiIcon,
        license: this.dataLicense,
        licenseIcon,
        tags: this.keywords,
        authors: this.authors,
      };

      if (this.$store) {
        const { categoryCards, cardBGImages } = this.$store.getters;
        enhanceTitleImg(previewEntry, cardBGImages, categoryCards);
      }

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
      return this.activeElements.contactEmail
          || this.activeElements.contactGivenName
          || this.activeElements.contactSurname;
    },
    anyPreviewsChanged() {
      return this.previews.contactGivenName !== null
          || this.previews.contactSurname !== null
          || this.previews.contactEmail !== null;
    },
  },
  methods: {
    isContactPropertyReadOnly(property) {
      return this.contactInfoReadOnly || this.mixinMethods_isFieldReadOnly(property);
    },
    contactPropertyHint(property) {

      if (this.contactInfoReadOnly) {
        return 'Not editable because the contact is defined in the author picker';
      }

      return this.mixinMethods_readOnlyHint(property);
    },
    clearPreviews() {
      this.previews.contactGivenName = null;
      this.previews.contactSurname = null;
      this.previews.contactEmail = null;
      this.previews.metadataTitle = null;
    },
    // Validate contact author properties by calling isFieldValid()
    // Returns true if all properties are valid, else returns false
    validateAuthor(authorObject) {

      const properties = ['contactEmail', 'contactGivenName', 'contactSurname'];

      // Validate fields corresponding to properties
      for (let i = 0; i < properties.length; i++) {
        isFieldValid(properties[i], authorObject[properties[i]], this.validations, this.validationErrors);
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
    getFullName(authorObj) {
      if (!authorObj) {
        return [];
      }
      return getAuthorName(authorObj);
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
    changeProperty(property, value) {
      this.previews[property] = value;
      this.validateProperty(property, value);
    },
    validateProperty(property, value) {
      return isFieldValid(property, value, this.validations, this.validationErrors);
    },
    catchPickerAuthorChange(pickedAuthorName, hasAuthor) {

      this.authorPickerTouched = true;
      this.authorIsPicked = hasAuthor;

      if (this.authorIsPicked) {
        const author = this.getAuthorByName(pickedAuthorName);
        const authorObject = this.getAuthorObject(author);

        this.previews.contactGivenName = authorObject?.contactGivenName;
        this.previews.contactSurname = authorObject?.contactSurname;
        this.previews.contactEmail = authorObject?.contactEmail;

        if (this.validateAuthor(authorObject)) {
          this.setFullContactInfos(authorObject);
        }
      } else {
        // has to be an empty string here otherwise the old value (via $props)
        // would be shown
        this.previews.contactGivenName = '';
        this.previews.contactSurname = '';
        this.previews.contactEmail = '';
      }

    },
    getAuthorByName(fullName) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.fullName === fullName);
      return found[0] || {};
    },
    getAuthorByEmail(email) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.email === email);
      return found[0] || {};
    },
    getAuthorByNameProp(property, value) {

      const authors = this.existingAuthorsWrap;

      if (property === 'contactGivenName') {
        const found = authors.filter(auth => auth.firstName === value);
        return found[0] || null;
      }

      if (property === 'contactSurname') {
        const found = authors.filter(auth => auth.lastName === value);
        return found[0] || null;
      }

      return null;
    },
    getAuthorObject(author) {

      if (author) {
        return {
          contactGivenName: author.firstName.trim(),
          contactSurname: author.lastName.trim(),
          contactEmail: author.email.trim(),
        };
      }

      return null;
    },

    notifyTitleChange(property, value) {
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
      let authorObject = {
        contactGivenName: this.contactGivenNameField,
        contactSurname: this.contactSurnameField,
        contactEmail: this.contactEmailField,
      }

      if (property === 'contactEmail') {
        if (isFieldValid(property, value, this.validations, this.validationErrors)) {

          // autocomplete author
          const author = this.getAuthorByEmail(value);

          const autoCompletedAuthorObject = this.getAuthorObject(author);

          if (autoCompletedAuthorObject) {
            this.previews.contactGivenName = autoCompletedAuthorObject.contactGivenName;
            this.previews.contactSurname = autoCompletedAuthorObject.contactSurname;

            // overwrite any infos from the text-fields with the author infos
            // from the autocomplete
            authorObject = autoCompletedAuthorObject;

            // this makes the text-fields readonly again
            this.authorPickerTouched = false;
          }
        }
      }


      // store all the contact infos because notifyChanges is only called
      // when the user focus leaves any of the fields, therefore all changes
      // must be stored

      if (isObjectValid(this.validationProperties, authorObject, this.validations, this.validationErrors)) {
        this.setFullContactInfos(authorObject);
      }

    },
    setFullContactInfos(authorObject) {

      const newHeaderInfo = {
        ...this.$props,
        ...authorObject,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });
    },
    setHeaderInfo(property, value) {

      const newHeaderInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });
    },
  },
  data: () => ({
    authorIsPicked: false,
    authorPickerTouched: false,
    previews: {
      metadataTitle: null,
      contactGivenName: null,
      contactSurname: null,
      contactEmail: null,
    },
    labels: {
      title: EDIT_METADATA_MAIN_TITLE,
      contactPerson: 'Contact Person',
      labelTitle: 'Research Dataset Title',
      labelContactEmail: 'Contact Email',
      labelContactGivenName: 'Contact Given Name',
      labelContactSurname: 'Contact Surname',
      instructions: 'The header is part of the main metadata information.' +
          ` Together with the other information in the ${EDIT_STEP_TITLE_MAIN_METADATA} step, it represents the core information for your research dataset.`,
      instructions2: 'Enter a title for your research dataset. Please make sure that title is meaningful and specific.',
      authorInstructions: 'Enter an email address as main contact and maintainer of this dataset.',
      authorOr: '<strong>Or</strong> pick <br /> an author',
      authorAutoComplete: 'If an author is picked or found with the email address the names is <strong>autocompleted</strong>!',
      placeholderTitle: 'Enter the title for your metadata entry here',
      placeholderHeaderTitle: 'Your Metadata Title',
      placeholderContactEmail: 'Enter contact email address here',
      placeholderContactGivenName: 'Enter contact given (first) name here',
      placeholderContactSurname: 'Enter contact surname name here',
      previewText: 'Metadata Header Preview',
      authorDropdown: 'Click here and start typing to select an existing EnviDat author',
    },
    validationProperties: [
      'contactEmail',
      'contactGivenName',
      'contactSurname',
    ],
    validationErrors: {
      metadataTitle: null,
      contactGivenName: null,
      contactSurname: null,
      contactEmail: null,
    },
    activeElements: {
      contactGivenName: false,
      contactSurname: false,
      contactEmail: false,
    },
    iconName: imageContact,
    iconMail: imageMail,
  }),
  components: {
    MetadataHeader,
    BaseUserPicker,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>

.compact-form {
  transform: scale(0.875);
  transform-origin: left;
}

</style>
