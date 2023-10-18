<template>
  <v-card id="EditAddExistingAuthor"
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
                          :readonly="isUserPickerReadOnly"
                          :hint="isUserPickerReadOnly ? mixinMethods_readOnlyHint('authors') : labels.authorPickHint"
                          @blur="notifyChange"
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

import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';


import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';
import { getArrayOfFullNames } from '@/factories/authorFactory';
import { getValidationMetadataEditingObject, isFieldValid } from '@/factories/userEditingValidations';
import { EDIT_METADATA_AUTHORS_TITLE } from '@/factories/metadataConsts';


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
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    isUserPickerReadOnly() {
      return this.mixinMethods_isFieldReadOnly('authors');
    },
    baseUserPickerObject() {
      return getArrayOfFullNames(this.existingEnviDatUsers);
    },
    preselectAuthorNames() {
      return this.previewAuthors ? getArrayOfFullNames(this.previewAuthors) : getArrayOfFullNames(this.authors);
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_AUTHOR_LIST);
    },
  },
  methods: {
    clearPreviews() {
      // previewAuthors is expected to be null when normal instead of []
      // because this way we know when a user removed the last author entry
      // is null and we can show an empty selection box with the error validation
      // not saving the users changes, but reflecting their action and show the error
      this.previewAuthors = null;
    },
    validateProperty(property, value){
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
    catchRemovedUsers(pickedUsers) {
      this.changePreviews(pickedUsers);
    },
    catchPickedUsers(pickedUsers) {
      this.changePreviews(pickedUsers);
    },
    changePreviews(authorsNames){
      this.previewAuthors = this.getFullAuthors(authorsNames);
    },
    getFullAuthors(authorsNames) {
      const fullAuthors = [];

      authorsNames.forEach((name) => {
        let author = this.getAuthorByName(name, this.authors);

        // if the author is part of the dataset authors, pick it as it is
        // including the existing dataCredits
        if (!author) {
          // if the author is newly picked, use the existing list as reference
          author = this.getAuthorByName(name, this.existingEnviDatUsers);
        }

        if (author) {
          fullAuthors.push(author);
        }
      });

      return fullAuthors;
    },
    notifyChange() {

      if (!this.previewAuthors) {
        return;
      }

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_AUTHOR_LIST,
        data: {
          ...this.$props,
          authors: this.previewAuthors,
        },
      });

      // DO NOT clear the preview because than the user isn't able to remove the last author
      // this lead to a UX where the user had to add a second author to then remove the first, it
      // changes want to be made
    },
    getAuthorByName(fullName, authors) {
      const found = authors.filter(auth => auth.fullName === fullName);
      return found.length > 0 ? found[0] : null;
    },
  },
  data: () => ({
    labels: {
      title: EDIT_METADATA_AUTHORS_TITLE,
      instructions: 'Here are can add authors from other published datasets to your dataset.',
      userPickInstructions: 'Pick an author from the list to add to your dataset. To remove click on the close icon of an author.',
      authorPickHint: 'Start typing the name in the text field to search for an author.',
    },
    previewAuthors: null,
  }),
  components: {
    BaseUserPicker,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>


</style>
