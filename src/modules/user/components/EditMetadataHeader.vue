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
        <BaseUserPicker v-bind="baseUserPickerObject"
                        @removedUsers="catchRemovedUsers"
                        @pickedUsers="catchPickedUsers"/>
      </v-col>


      <v-col>

        <v-text-field :label="labels.labelContactGivenName"
                      outlined
                      :rules="rulesGivenName"
                      required
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactGivenName"
                      v-model="contactGivenNameField" />

        <v-text-field :label="labels.labelContactSurname"
                      outlined
                      :rules="rulesSurname"
                      required
                      dense
                      prepend-icon="person"
                      :placeholder="labels.placeholderContactSurname"
                      v-model="contactSurnameField" />

        <v-text-field :label="labels.labelContactEmail"
                      outlined
                      :rules="rulesEmail"
                      required
                      dense
                      prepend-icon="email"
                      :placeholder="labels.placeholderContactEmail"
                      v-model="contactEmailField" />


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
      default: null,
    },
    existingEnviDatUsers: {
      type: Array,
      default: () => [],
    },
    existingAuthors: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    existingAuthorsWrap() {
      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingAuthors`];
      }

      return this.existingAuthors;
    },
    baseUserPickerObject() {
      return {
        users: this.fullNameUsers(this.existingAuthorsWrap),
      };
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
        contactEmail: this.contactEmailField,
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
    contactGivenNameField: {
      get() {
        return this.contactGivenName;
      },
      set(value) {
        this.contactGivenName = value;
        this.setContactAuthor();
      },
    },
    contactSurnameField: {
      get() {
        return this.contactSurname;
      },
      set(value) {
        this.contactSurname = value;
        this.setContactAuthor();
      },
    },
    contactEmailField: {
      get() {
        return this.contactEmail;
      },
      set(value) {
        this.contactEmail = value;
        this.setContactAuthor();
      },
    },
    inputContactFullName() {
      return `${this.contactGivenNameField.trim()} ${this.contactSurnameField.trim()}`;
    },
  },
  methods: {
    setContactAuthor() {
      const contAuthor = {
        contactGivenName: this.contactGivenName,
        contactSurname: this.contactSurname,
        contactEmail: this.contactEmail,
      };
      this.setHeaderInfo('contactAuthor', contAuthor);
    },
    fullNameUsers(userObjects) {

      const fullNameArray = [];

      userObjects.forEach((user) => {
        if (user.fullName) {
          fullNameArray.push(user.fullName);
        } else {
          console.error(`fullNameUsers(userObjects) object ${user} missing fullName key`);
        }
      });

      return fullNameArray;
    },
    catchRemovedUsers(pickedUsers) {
      this.notifyChange(pickedUsers);
    },
    catchPickedUsers(pickedUsers) {
      this.notifyChange(pickedUsers);
    },
    getAuthorByName(fullName) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.fullName === fullName);
      return found?.length > 0 ? found[0] : null;
    },
    notifyChange(authorName) {

      const author = this.getAuthorByName(authorName);

      // Call setContactDetails to automatically assign and clear contact details variables
      this.setContactDetails(author);

      this.setContactAuthor();

    },
    // Sets contact details variables if author is not null
    // Else clears contact details variables
    setContactDetails(author) {

      if (author) {
        this.contactGivenNameField = author.firstName;
        this.contactSurnameField = author.lastName;
        this.contactEmailField = author.email;
      }
      else {
        this.contactGivenNameField = '';
        this.contactSurnameField = '';
        this.contactEmailField = '';
      }

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
    contactGivenName: '',
    contactSurname: '',
    contactEmail: '',
   }),
  components: {
    MetadataHeader,
    BaseUserPicker,
  },
};
</script>

<style scoped>
</style>
