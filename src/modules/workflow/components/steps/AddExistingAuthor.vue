<template>
  <v-card id="AddExistingAuthor" class="pa-0" flat :loading="loadingColor">
    <v-container fluid class="pa-4">
      <template slot="progress">
        <v-progress-linear color="primary" indeterminate />
      </template>

      <v-row>
        <!-- <v-col v-if="message">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col> -->
      </v-row>

      <v-row>
        <v-col class="mb-0 pa-0">
          <v-row class="mb-5">
            <v-col>
              <div class="font-weight-bold">{{ labels.title }}</div>
              <div class="text-caption">
                {{ labels.instructions }}, {{ labels.userPickInstructions }}
              </div>
            </v-col>
          </v-row>
          <BaseUserPicker
            :users="baseUserPickerObject"
            :preSelected="preselectAuthorNames"
            :error-messages="validationErrors?.authors"
            :multiplePick="true"
            :isClearable="isClearable"
            :readonly="isReadOnly('authors')"
            :hint="readOnlyHint('authors')"
            @blur="notifyChange"
            @removedUsers="catchRemovedUsers"
            @pickedUsers="catchPickedUsers"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
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

import {
  getUserPickerObjects,
  getFullAuthorsForUserPicker,
} from '@/factories/authorFactory';
import { EDIT_METADATA_AUTHORS_TITLE } from '@/factories/metadataConsts';

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus.js';

import {
  isReadOnlyField,
  getReadOnlyHint,
} from '@/modules/workflow/utils/useReadonly';

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
    validationErrors: {
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
    baseUserPickerObject() {
      return getUserPickerObjects(this.existingEnviDatUsers);
    },
    preselectAuthorNames() {
      return this.previewAuthors
        ? this.previewAuthors.map((author) => author.fullName)
        : this.authors.map((author) => author.fullName);
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
    catchRemovedUsers(pickedUsersEmails: string[]) {
      this.changePreviews(pickedUsersEmails);
    },
    catchPickedUsers(pickedUsersEmails: string[]) {
      this.changePreviews(pickedUsersEmails);
    },
    changePreviews(pickedUsersEmails: string[]) {
      this.previewAuthors = getFullAuthorsForUserPicker(
        pickedUsersEmails,
        this.authors,
        this.existingEnviDatUsers,
      );
    },
    notifyChange() {
      if (!this.previewAuthors) {
        return;
      }

      this.$emit('save', {
        authors: this.previewAuthors,
      });

      // DO NOT clear the preview because than the user isn't able to remove the last author
      // this lead to a UX where the user had to add a second author to then remove the first, it
      // changes want to be made
    },
    isReadOnly(dateProperty) {
      return isReadOnlyField(dateProperty);
    },
    readOnlyHint(dateProperty) {
      return getReadOnlyHint(dateProperty);
    },
  },
  data: () => ({
    labels: {
      title: EDIT_METADATA_AUTHORS_TITLE,
      instructions:
        'Here are can add authors from other published datasets to your dataset.',
      userPickInstructions:
        'Pick an author from the list to add to your dataset. To remove click on the close icon of an author.',
      authorPickHint:
        'Start typing the name in the text field to search for an author.',
    },
    previewAuthors: null,
  }),
  components: {
    BaseUserPicker,
  },
};
</script>

<style scoped></style>
