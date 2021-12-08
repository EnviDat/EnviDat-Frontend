<template>
  <v-card id="EditAddExistingAuthor"
          flat
          class="pa-0"
          :loading="loading" >

    <v-container fluid
                 class="pa-4" >

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

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
          {{ labels.instructions }}
        </v-col>
      </v-row>

      <v-row >
        <v-col >
          <BaseUserPicker :users="baseUserPickerObject"
                          :preSelected="preselectAuthorNames"
                          :multiplePick="true"
                          :isClearable="isClearable"
                          :instructions="labels.userPickInstructions"
                          :errorMessages="baseUserErrorMessages"
                          :readonly="mixinMethods_isFieldReadOnly('authors')"
                          :hint="mixinMethods_readOnlyHint('authors')"
                          @removedUsers="catchRemovedUsers"
                          @pickedUsers="catchPickedUsers"/>
        </v-col>
      </v-row>

    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Show a title, instructions and a button to create a new author
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 16:09:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import BaseUserPicker from '@/components/BaseElements/BaseUserPicker';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';
import { getArrayOfFullNames } from '@/factories/authorFactory';
import { getValidationMetadataEditingObject, isFieldValid } from '@/factories/userEditingFactory';


export default {
  name: 'EditAddExistingAuthor',
  props: {
    existingEnviDatUsers: {
      type: Array,
      default: () => [],
    },
    authors: {
      type: Array,
      default: () => [],
    },
    isClearable: {
      type: Boolean,
      default: false,
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
    baseUserPickerObject() {
      return getArrayOfFullNames(this.existingEnviDatUsers);
    },
    baseUserErrorMessages() {
      return this.validationErrors.authors;
    },
    preselectAuthorNames() {
      return this.previewAuthors?.length > 0 ? getArrayOfFullNames(this.previewAuthors) : getArrayOfFullNames(this.authors);
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_AUTHOR_LIST);
    },
  },
  methods: {
    clearPreviews() {
      this.previewAuthors = [];
    },
    validateProperty(property, value){
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
    catchRemovedUsers(pickedUsers) {
      this.notifyChange(pickedUsers);
    },
    catchPickedUsers(pickedUsers) {
      this.notifyChange(pickedUsers);
    },
    notifyChange(authorsNames) {

      const authors = [];

      authorsNames.forEach((name) => {
        const author = this.getAuthorByName(name);
        if (author) {
          authors.push(author);
        }
      });

      this.previewAuthors = authors;

      if (this.validateProperty('authors', authors)) {

        eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_AUTHOR_LIST,
          data: {
            ...this.$props,
            authors,
          },
        });
      } else {
        this.previewAuthors = [];
      }
    },
    getAuthorByName(fullName) {
      const authors = this.existingEnviDatUsers;
      const found = authors.filter(auth => auth.fullName === fullName);
      return found?.length > 0 ? found[0] : null;
    },
  },
  data: () => ({
    labels: {
      title: 'Change Metadata Authors',
      instructions: 'Choose authors from any metadata entry or pick them from the list of EnviDat users.',
      userPickInstructions: 'Pick an author from the list or start typing in the text field. To remove click on the close icon of an author.',
    },
    validationErrors: {
      authors: '',
    },
    previewAuthors: [],
  }),
  components: {
    BaseUserPicker,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>


</style>
