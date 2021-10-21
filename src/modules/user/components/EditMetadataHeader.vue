<template>
<v-card id="EditMetadataHeader" class="pa-4">

  <v-container fluid
                class="pa-0 fill-height" >

    <v-row>

      <v-col>
        <div class="text-h5">{{ labels.cardTitle }}</div>
      </v-col>

    </v-row>


    <v-row>

      <v-col>
        <div class="text-body-1">{{ labels.instructions }}</div>
      </v-col>

    </v-row>

    <v-row dense>

      <v-col cols="8">
        <v-text-field :label="labels.labelTitle"
                      outlined
                      :rules="rulesTitle"
                      required
                      dense
                      prepend-icon="import_contacts"
                      :placeholder="labels.placeholderTitle"
                      v-model="metadataTitleField" />

      </v-col>

    </v-row>


    <v-row dense>

      <v-col>
        <div class="text-body-1">{{ labels.authorInstructions }}</div>
      </v-col>

    </v-row>


    <v-row dense>

      <v-col >
        <BaseUserPicker :users="fullNameUsers"
                        :preSelected="preselectAuthorName"
                        @removedUsers="catchAuthorChange"
                        @pickedUsers="catchAuthorChange"/>
      </v-col>


      <v-col>

        <v-text-field :label="labels.labelContactGivenName"
                      outlined
                      :rules="rulesGivenName"
                      required
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactGivenName"
                      :value="contactAuthorField.contactGivenName"
                      @input="notifyChange('contactGivenName', $event)" />

        <v-text-field :label="labels.labelContactSurname"
                      outlined
                      :rules="rulesSurname"
                      required
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactSurname"
                      :value="contactAuthorField.contactSurname"
                      @input="notifyChange('contactSurname', $event)" />

        <v-text-field :label="labels.labelContactEmail"
                      outlined
                      :rules="rulesEmail"
                      required
                      dense
                      prepend-icon="email"
                      :placeholder="labels.placeholderContactEmail"
                      :value="contactAuthorField.contactEmail"
                      @input="notifyChange('contactEmail', $event)"/>


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
 * @summary shows the title, main contact information, and header preview
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-10-11 10:05:50
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
import TagChip from '@/components/Chips/TagChip';

import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';
import { enhanceTitleImg } from '@/factories/metaDataFactory';


export default {
  name: 'EditMetadataHeader',
  props: {
    metadataTitle: {
      type: String,
      default: '',
    },
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
    contactAuthor: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    contactAuthorField: {
      get() {
        let contactAuthor = { ...this.contactAuthor };

        if (Object.keys(contactAuthor).length === 0) {
          contactAuthor = {
            contactGivenName: '',
            contactSurname: '',
            contactEmail: '',
          };
        }

        return contactAuthor;
      },
    },
    preselectAuthorName() {
      return this.getFullName(this.contactAuthor);
    },
    existingAuthorsWrap() {
      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingAuthors`];
      }

      return this.existingAuthors;
    },
    fullNameUsers() {
      return this.getFullNameUsers(this.existingAuthorsWrap);
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
        contactEmail: this.inputContactEmail,
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
    metadataTitleField: {
      get() {
        return this.metadataTitle;
      },
      set(value) {
        this.setHeaderInfo('metadataTitle', value);
      },
    },
    inputContactFullName() {
      // eslint-disable-next-line no-prototype-builtins
      if (this.contactAuthor && this.contactAuthor.hasOwnProperty('contactGivenName') && this.contactAuthor.hasOwnProperty('contactSurname')) {
        return `${this.contactAuthor.contactGivenName.trim()} ${this.contactAuthor.contactSurname.trim()}`;
      }
      return '';
    },
    inputContactEmail() {
      // eslint-disable-next-line no-prototype-builtins
      if (this.contactAuthor && this.contactAuthor.hasOwnProperty('contactEmail')) {
        return `${this.contactAuthor.contactEmail.trim()}`;
      }
      return '';
    },
  },
  methods: {
    // Returns array of fullName strings extracted from userObjects sorted by last name
    getFullNameUsers(userObjects) {

      const fullNameArray = [];

      userObjects.sort((a, b) => ((a.lastName.toUpperCase() > b.lastName.toUpperCase()) ? 1 : -1));

      userObjects.forEach((user) => {
        if (user.fullName) {
          fullNameArray.push(user.fullName);
        } else {
          console.error(`fullNameUsers(userObjects) object ${user} missing fullName key`);
        }
      });

      return fullNameArray;
    },
    getFullName(authorObj) {
       return [`${authorObj.contactGivenName.trim()} ${authorObj.contactSurname.trim()}`];
    },
    catchAuthorChange(pickedAuthor) {

      // Get author object
      const author = this.getAuthorByName(pickedAuthor);

      // Call getAuthorObject to assign authorObject values
      const authorObject = this.getAuthorObject(author);

      // Call setHeaderInfo to emit authorObject to eventBus
      this.setHeaderInfo('contactAuthor', authorObject);

    },
    getAuthorByName(fullName) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.fullName === fullName);
      return found?.length > 0 ? found[0] : null;
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
    editEntry(contactAuthorObject, property, value) {
      contactAuthorObject[property] = value;
    },
    notifyChange(property, value) {

      const contactAuthorCopy = { ...this.contactAuthorField };

      this.editEntry(contactAuthorCopy, property, value);

      this.setHeaderInfo('contactAuthor', contactAuthorCopy);

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
      cardTitle: 'Metadata Basic Information',
      labelTitle: 'Metadata Entry Title',
      labelContactEmail: 'Contact Email',
      labelContactGivenName: 'Contact Given Name',
      labelContactSurname: 'Contact Surname',
      instructions: 'Please enter research dataset title. Please make sure that title is meaningful and specific.',
      authorInstructions: 'Please choose main contact author from dropdown list or enter author\'s details.',
      placeholderTitle: 'Enter the title for your metadata entry here',
      placeholderHeaderTitle: 'Your Metadata Title',
      placeholderContactEmail: 'Enter contact email address here',
      placeholderContactGivenName: 'Enter contact given (first) name here',
      placeholderContactSurname: 'Enter contact surname name here',
      previewText: 'Metadata Header Preview',
      authorDropdown: 'Click here and start typing to select an existing EnviDat author',
    },
    rulesTitle: [v => !!v || 'Title is required'],
    rulesGivenName: [v => !!v || 'Contact given (first) name is required'],
    rulesSurname: [v => !!v || 'Contact surname is required'],
    rulesEmail: [
       v => !!v || 'Contact Email is required',
       v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Please enter valid email address',
      ],
    iconName: imageContact,
    iconMail: imageMail,
   }),
  components: {
    MetadataHeader,
    BaseUserPicker,
    TagChip,
  },
};
</script>

<style scoped>
</style>
