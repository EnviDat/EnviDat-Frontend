<template>
<v-card id="EditMetadataHeader"
        class="pa-0"
        :loading="loading" >

  <v-container fluid
                class="pa-4 fill-height" >

    <template slot="progress">
      <v-progress-linear color="primary"
                         indeterminate />
    </template>

    <v-row >

      <v-col class="text-h5" cols="8">
        {{ labels.title }}
      </v-col>

      <v-col v-if="message" cols="4" class="pl-16">
        <BaseStatusLabelView statusIcon="check"
                             statusColor="success"
                             :statusText="message"
                             :expandedText="messageDetails" />
      </v-col>
      <v-col v-if="error" cols="4" class="pl-16">

        <BaseStatusLabelView statusIcon="error"
                             statusColor="error"
                             :statusText="error"
                             :expandedText="errorDetails" />
      </v-col>

    </v-row>


    <v-row >

      <v-col class="text-body-1">
        {{ labels.instructions }}
      </v-col>

    </v-row>


    <v-row >

      <v-col cols="8" class="pb-0">

        <v-text-field ref="metadataTitle"
                      :label="labels.labelTitle"
                      outlined
                      dense
                      :readonly="mixinMethods_isFieldReadOnly('metadataTitle')"
                      :hint="mixinMethods_readOnlyHint('metadataTitle')"
                      prepend-icon="import_contacts"
                      :error-messages="validationErrors.metadataTitle"
                      :placeholder="labels.placeholderTitle"
                      @input="catchTitleChange"
                      @change="notifyChange('metadataTitle', $event)"
                      :value="metadataTitleField" />

      </v-col>

    </v-row>


    <v-row >
      <v-col class="text-h6 pb-0">
        {{ labels.contactPerson }}
      </v-col>
    </v-row>


    <v-row >
      <v-col class="text-body-1">
        {{ labels.authorInstructions }}
      </v-col>
    </v-row>


    <v-row >
      <v-col>

        <v-text-field ref="contactEmail"
                      :label="labels.labelContactEmail"
                      outlined
                      :error-messages="validationErrors.contactEmail"
                      :readonly="mixinMethods_isFieldReadOnly('contactEmail')"
                      :hint="mixinMethods_readOnlyHint('contactEmail')"
                      dense
                      prepend-icon="email"
                      :placeholder="labels.placeholderContactEmail"
                      :value="contactEmailField"
                      @input="catchEmailChange"
                      @change="notifyChange('contactEmail', $event)" />

        <v-text-field ref="contactGivenName"
                      :label="labels.labelContactGivenName"
                      outlined
                      :error-messages="validationErrors.contactGivenName"
                      :readonly="mixinMethods_isFieldReadOnly('contactGivenName')"
                      :hint="mixinMethods_readOnlyHint('contactGivenName')"
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactGivenName"
                      :value="contactGivenNameField"
                      @input="catchGivenNameChange"
                      @change="notifyChange('contactGivenName', $event)" />

        <v-text-field ref="contactSurname"
                      :label="labels.labelContactSurname"
                      outlined
                      :error-messages="validationErrors.contactSurname"
                      :readonly="mixinMethods_isFieldReadOnly('contactSurname')"
                      :hint="mixinMethods_readOnlyHint('contactSurname')"
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactSurname"
                      :value="contactSurnameField"
                      @input="catchSurnameChange"
                      @change="notifyChange('contactSurname', $event)" />

      </v-col>

      <v-col cols="4" class="pl-16" >

        <BaseUserPicker :users="fullNameUsers"
                        :preSelected="preselectAuthorName"
                        @removedUsers="catchAuthorChange"
                        @pickedUsers="catchAuthorChange"
        />
      </v-col>

    </v-row>


    <v-row dense>
      <v-col cols="12" class="text-body-1">
        {{ labels.previewText }}
      </v-col>
    </v-row>

    <v-row >
      <v-col cols="12">
        <MetadataHeader v-bind="metadataPreviewEntry" />
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

import {METADATA_NAMESPACE} from '@/store/metadataMutationsConsts';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';
import {enhanceTitleImg} from '@/factories/metaDataFactory';
// eslint-disable-next-line import/no-cycle
import {getValidationMetadataEditingObject, isFieldValid} from '@/factories/userEditingFactory';
import {getArrayOfFullNames, getAuthorName} from '@/factories/authorFactory';
import {EDIT_METADATA_MAIN_TITLE} from '@/factories/metadataConsts';


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
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    metadataTitleField: {
      get() {
        return this.previewTitle || this.metadataTitle;
      },
    },
    contactGivenNameField: {
      get() {
        return this.previewContactGivenName || this.contactGivenName;
      },
    },
    contactSurnameField: {
      get() {
        return this.previewContactSurname || this.contactSurname;
      },
    },
    contactEmailField: {
      get() {
        return this.previewContactEmail || this.contactEmail;
      },
    },
    preselectAuthorName() {
      const fullName = this.getFullName({
        given_name: this.contactGivenName,
        name: this.contactSurname,
      });

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
  },
  methods: {
    clearPreviews() {
      this.previewContactGivenName = '';
      this.previewContactSurname = '';
      this.previewContactEmail = '';
      this.previewTitle = '';
    },
    validateProperty(property, value){
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
    getFullName(authorObj) {
      if (!authorObj) {
        return [];
      }
      return getAuthorName(authorObj);
    },
    catchTitleChange(value) {
      this.previewTitle = value;
      this.validateProperty('metadataTitle', value);
    },
    catchEmailChange(value) {
      this.previewContactEmail = value;
      this.validateProperty('contactEmail', value);
    },
    catchGivenNameChange(value) {
      this.previewContactGivenName = value;
      this.validateProperty('contactGivenName', value);
    },
    catchSurnameChange(value) {
      this.previewContactSurname = value;
      this.validateProperty('contactSurname', value);
    },
    catchAuthorChange(pickedAuthor) {

      // Get author object
      const author = this.getAuthorByName(pickedAuthor);

      // Assign preview contact variables
      this.setPreviewContact(author);

      // Reset show preview Boolean variables to true
      this.showPreview();

      // Call getAuthorObject to assign authorObject values
      const authorObject = this.getAuthorObject(author);

      // Validate contact author properties
      const allPropertiesValid = this.validateAuthor(authorObject);

      // Call setContact to emit authorObj values to eventBus
      if (allPropertiesValid) {
        this.setContact(authorObject);
      }

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
    getAuthorByName(fullName) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.fullName === fullName);
      return found?.length > 0 ? found[0] : null;
    },
    getAuthorByEmail(email) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.email === email);
      return found?.length > 0 ? found[0] : null;
    },
    getAuthorByNameProp(property, value) {

      const authors = this.existingAuthorsWrap;

      if (property === 'contactGivenName') {
        const found = authors.filter(auth => auth.firstName === value);
        return found?.length > 0 ? found[0] : null;
      }

      if (property === 'contactSurname') {
        const found = authors.filter(auth => auth.lastName === value);
        return found?.length > 0 ? found[0] : null;
      }

      return null;

    },
    // Assigns show contact preview Boolean variables to true
    showPreview() {
      this.showPreviewGivenName = true;
      this.showPreviewSurname = true;
      this.showPreviewEmail = true;
    },
    // Assigns contact preview string variables
    // If author is null assigns preview string variables to empty strings
    setPreviewContact(author) {
      if (author) {
        this.previewContactGivenName = author.firstName.trim();
        this.previewContactSurname = author.lastName.trim();
        this.previewContactEmail = author.email.trim();
      } else {
        this.previewContactGivenName = '';
        this.previewContactSurname = '';
        this.previewContactEmail = '';
      }
    },
    // Returns object with contact details if author is not null
    // Else returns object with contact details values assigned to empty strings
    getAuthorObject(author) {

      if (author) {
        return {
          contactGivenName: author.firstName.trim(),
          contactSurname: author.lastName.trim(),
          contactEmail: author.email.trim(),
        };
      }
      return {
        contactGivenName: '',
        contactSurname: '',
        contactEmail: '',
      };
    },
    // Returns object with contact details if author is not null
    // Else returns null
    getAuthorOrNull(author) {

      if (author) {
        return {
          contactGivenName: author.firstName,
          contactSurname: author.lastName,
          contactEmail: author.email,
        };
      }
      return null;

    },
    notifyChange(property, value) {

      // Check if property is valid
      if (isFieldValid(property, value, this.validations, this.validationErrors)) {

        // If user already exists emit user email, given name and surname to eventBus
        // This will autocomplete the given name and surname fields
        if (property === 'contactEmail') {

          const selectedUser = this.getAuthorByEmail(value);

          const authorObject = this.getAuthorOrNull(selectedUser);

          // If authorObject exists emit to eventBus
          // Else emit property to eventBus
          if (authorObject) {
            this.setContact(authorObject);
            // Validate new author properties
            this.validateAuthor(authorObject);
          }
          else {
            this.setHeaderInfo(property, value);
          }
        }
        // Else emit property to eventBus
        else {
          this.setHeaderInfo(property, value);
        }

      }
    },
    setContact(authorObject) {

      const newHeaderInfo = {
        ...this.$props,
        ...authorObject,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });
    },
    setHeaderInfo(property, value) {

      const newHeaderInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_MAIN_HEADER,
        data: newHeaderInfo,
      });
    },
  },
  data: () => ({
    previewContactGivenName: '',
    previewContactSurname: '',
    previewContactEmail: '',
    previewTitle: '',
    labels: {
      title: EDIT_METADATA_MAIN_TITLE,
      contactPerson: 'Contact Person',
      labelTitle: 'Research Dataset Title',
      labelContactEmail: 'Contact Email',
      labelContactGivenName: 'Contact Given Name',
      labelContactSurname: 'Contact Surname',
      instructions: 'Please enter research dataset title. Please make sure that title is meaningful and specific.',
      authorInstructions: 'Please enter contact person\'s details or chose from dropdown list on the right.',
      placeholderTitle: 'Enter the title for your metadata entry here',
      placeholderHeaderTitle: 'Your Metadata Title',
      placeholderContactEmail: 'Enter contact email address here',
      placeholderContactGivenName: 'Enter contact given (first) name here',
      placeholderContactSurname: 'Enter contact surname name here',
      previewText: 'Metadata Header Preview',
      authorDropdown: 'Click here and start typing to select an existing EnviDat author',
    },
    validationErrors: {
      metadataTitle: null,
      contactGivenName: null,
      contactSurname: null,
      contactEmail: null,
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
