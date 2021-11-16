<template>
<v-card id="EditMetadataHeader" class="pa-4">

  <v-container fluid
                class="pa-0 fill-height" >

<!--    <v-row>-->

<!--      <v-col>-->
<!--        <div class="text-h5">{{ labels.cardTitle }}</div>-->
<!--      </v-col>-->

<!--    </v-row>-->


      <v-row dense>

        <v-col>
          <div class="text-h6">{{ labels.title }}</div>
        </v-col>

      </v-row>


    <v-row dense>

      <v-col>
        <div class="text-body-1 compact-form">{{ labels.instructions }}</div>
      </v-col>

    </v-row>

    <v-row dense class="compact-form">

      <v-col cols="8">
        <v-text-field :label="labels.labelTitle"
                      outlined
                      dense
                      prepend-icon="import_contacts"
                      :error-messages="validationErrors.metadataTitle"
                      :placeholder="labels.placeholderTitle"
                      v-model="metadataTitleField" />

      </v-col>

    </v-row>

    <v-row dense>

      <v-col>
        <div class="text-h6">{{ labels.contactPerson }}</div>
      </v-col>

    </v-row>


    <v-row dense>

      <v-col>
        <div class="text-body-1 compact-form">{{ labels.authorInstructions }}</div>
      </v-col>

    </v-row>


    <v-row dense class="compact-form">

      <v-col>

        <v-text-field :label="labels.labelContactEmail"
                      outlined
                      :error-messages="validationErrors.contactEmail"
                      required
                      dense
                      prepend-icon="email"
                      :placeholder="labels.placeholderContactEmail"
                      :value="contactEmailField"
                      @input="notifyChange('contactEmail', $event)" />

        <v-text-field :label="labels.labelContactGivenName"
                      outlined
                      :error-messages="validationErrors.contactGivenName"
                      required
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactGivenName"
                      :value="contactGivenNameField"
                      @input="notifyChange('contactGivenName', $event)" />

        <v-text-field :label="labels.labelContactSurname"
                      outlined
                      :error-messages="validationErrors.contactSurname"
                      required
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactSurname"
                      :value="contactSurnameField"
                      @input="notifyChange('contactSurname', $event)" />

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
      <v-col cols="12">
        <div class="text-body-1">{{ labels.previewText }}</div>
      </v-col>
    </v-row>

    <v-row dense >
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
 * Last modified  : 2021-11-15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_MAIN_HEADER,
  eventBus,
} from '@/factories/eventBus';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import MetadataHeader from '@/modules/metadata/components/Metadata/MetadataHeader';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker';

import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';
import { enhanceTitleImg } from '@/factories/metaDataFactory';
// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingFactory';
import {
  getArrayOfFullNames,
  getAuthorName,
} from '@/factories/authorFactory';


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
  },
  computed: {
    metadataTitleField: {
      get() {
        return this.metadataTitle;
      },
      set(value) {
        const property = 'metadataTitle';

        if (isFieldValid(property, value, this.validations, this.validationErrors)) {
          this.setHeaderInfo(property, value);
        }

      },
    },
    contactGivenNameField: {
      get() {
        return this.contactGivenName;
      },
    },
      contactSurnameField: {
        get() {
          return this.contactSurname;
        },
    },
    contactEmailField: {
      get() {
        return this.contactEmail;
      },
    },
    // TODO fix this to longer use contactAuthor object
    preselectAuthorName() {
      return [this.getFullName(this.contactAuthor)];
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

      const previewEntry = {
        metadataTitle: this.metadataTitleField || this.labels.placeholderHeaderTitle,
        title: this.metadataTitleField || this.labels.placeholderHeaderTitle, // is needed for the enhanceTitleImg
        showCloseButton: false,
        contactName: this.inputContactFullName,
        contactIcon,
        contactEmail: this.contactEmail,
        mailIcon,
        doiIcon,
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
    inputContactFullName() {
      return `${this.contactGivenName.trim()} ${this.contactSurname.trim()} `;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_MAIN_HEADER);
    },
  },
  methods: {
    getFullName(authorObj) {
      if (!authorObj) {
        return [];
      }
      return getAuthorName(authorObj);
    },
    catchAuthorChange(pickedAuthor) {

      // Get author object
      const author = this.getAuthorByName(pickedAuthor);

      // Call getAuthorObject to assign authorObject values
      const authorObject = this.getAuthorObject(author);

      // Validate contact author properties
      this.validateAuthor(authorObject);

      // Call setContact to emit authorObject values to eventBus
      this.setContact(authorObject);

    },
    // Validate contact author properties by calling isFieldValid()
    validateAuthor(authorObject) {
      const properties = ['contactEmail', 'contactGivenName', 'contactSurname'];
      properties.forEach(prop => isFieldValid(prop, authorObject[prop], this.validations, this.validationErrors));
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
    // Returns object with contact details if author is not null
    // Else returns object with contact details values assigned to empty strings
    getAuthorObject(author) {

      if (author) {
        return {
          contactGivenName: author.firstName,
          contactSurname: author.lastName,
          contactEmail: author.email,
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
    labels: {
      // cardTitle: 'Metadata Basic Information',
      title: 'Title',
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
  },
};
</script>

<style scoped>

  .compact-form {
    transform: scale(0.875);
    transform-origin: left;
  }

</style>
