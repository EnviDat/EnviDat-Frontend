<template>

  <v-container fluid
               class="pa-0"
               id="EditAuthorList" >

    <v-row >
      <v-col cols="6" >

        <v-row >
          <v-col v-show="!selectedAuthor"
                 cols="12">

              <EditAddExistingAuthor v-bind="authorPickingGenericProps" />
          </v-col>

          <v-col v-if="isReadOnly(METADATA_AUTHORS_PROPERTY)"
                 cols="12">

              <v-card>
                <v-card-title>
                  {{ EDIT_METADATA_ADD_AUTHOR_TITLE }}
                </v-card-title>
                <v-card-text>
                  Adding a new Author is readonly, because: {{ readOnlyHint(METADATA_AUTHORS_PROPERTY) }}
                </v-card-text>
              </v-card>
          </v-col>

          <v-col v-else
                 cols="12">

            <EditAddAuthor v-bind="editAddAuthorObject"
                           @closeClicked="catchEditAuthorClose" />
          </v-col>

        </v-row>
      </v-col>

      <v-col cols="6" >
        <EditMetadataAuthors v-bind="authorListingGenericProps"
                              @editAuthorClick="catchEditAuthorClick"/>
      </v-col>
    </v-row>

  </v-container>

</template>

<script>
/**
 * EditAuthorList.vue shows all the authors of a metadata entry in a list.
 *
 * @summary shows the authors of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-09-01 11:00:41
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import EditAddAuthor from '@/modules/user/components/EditAddAuthor.vue';
import EditAddExistingAuthor from '@/modules/user/components/EditAddExistingAuthor.vue';
import EditMetadataAuthors from '@/modules/user/components/EditMetadataAuthors.vue';

import {
  enhanceAuthorsFromAuthorMap,
  getAuthorName,
} from '@/factories/authorFactory';

import {
  CANCEL_EDITING_AUTHOR,
  eventBus,
  SELECT_EDITING_AUTHOR,
} from '@/factories/eventBus';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';
import { EDIT_METADATA_ADD_AUTHOR_TITLE, METADATA_AUTHORS_PROPERTY } from '@/factories/metadataConsts';


export default {
  name: 'EditAuthorList',
  components: {
    EditMetadataAuthors,
    EditAddAuthor,
    EditAddExistingAuthor,
  },
  props: {
    existingAuthors: {
      type: Array,
      default: undefined,
    },
    authors: {
      type: Array,
      default: undefined,
    },
    // only used for testing via storybook
    authorsMap: {
      type: Object,
      default: () => {},
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
  computed: {
    authorsMapWrap() {
      if (this.authorsMap) {
        return this.authorsMap;
      }

      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/authorsMap`];
      }

      return undefined;
    },
    existingAuthorsWrap() {
      if (this.existingAuthors) {
        return this.existingAuthors;
      }

      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingAuthors`];
      }

      return undefined;
    },
    authorsWrap() {
      let authors = this.authors

      if (!authors && this.$store) {
        authors = this.$store.getters[`${USER_NAMESPACE}/authors`] || [];
      }

      if (!authors) {
        return undefined;
      }

      const authorsMap = this.authorsMapWrap;
      return enhanceAuthorsFromAuthorMap(authors, authorsMap)
    },
    noDataCreditAuthorsWrap() {
      const authors = this.existingAuthorsWrap ? [...this.existingAuthorsWrap] : [];

      for (let i = 0; i < authors.length; i++) {
        authors[i] = {
          ...authors[i],
          dataCredit: [],
        }
      }

      return authors
    },
    authorPickingGenericProps() {
      return {
        authors: this.authorsWrap,
        existingEnviDatUsers: this.noDataCreditAuthorsWrap,
        isClearable: false,
        loading: this.loading, // || this.authorsMapLoading,
        message: this.message,
        messageDetails: this.messageDetails,
        error: this.error,
        errorDetails: this.errorDetails,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    authorListingGenericProps() {

      return {
        authors: this.authorsWrap,
        existingAuthors: this.existingAuthorsWrap,
        loading: this.loading, // || this.authorsMapLoading,
        authorDetailsConfig: {
          showDatasetCount: true,
          showAuthorInfos: true,
          showDataCredits: false,
          showDataCreditScore: false,
        },
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    selectedAuthor() {
      let selectedAuthor = null;
      const authors = this.authors;

      if (authors?.length > 0) {
        const selected = authors.filter(r => r.isSelected);

        if (selected.length > 0) {
          selectedAuthor = selected[0];
        }
      }

      return selectedAuthor;
    },
    editAddAuthorObject() {
      if (!this.selectedAuthor) {
        return {
          loading: this.loading,
          existingAuthors: this.noDataCreditAuthorsWrap,
          readOnlyFields: this.readOnlyFields,
          readOnlyExplanation: this.readOnlyExplanation,
        };
      }

      return {
        loading: this.loading,
        titleLabel: `Editing ${getAuthorName(this.selectedAuthor)}`,
        isEditingAuthor: !!this.selectedAuthor,
        existingAuthors: this.noDataCreditAuthorsWrap,
        email: this.selectedAuthor.email,
        firstName: this.selectedAuthor.firstName,
        lastName: this.selectedAuthor.lastName,
        affiliation: this.selectedAuthor.affiliation,
        identifier: this.selectedAuthor.identifier,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
  },
  methods: {
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
    catchEditAuthorClick(author) {
      if (author.isSelected) {
        eventBus.emit(CANCEL_EDITING_AUTHOR, author.email);
      } else {
        eventBus.emit(SELECT_EDITING_AUTHOR, author.email);
      }
    },
    catchEditAuthorClose() {
      eventBus.emit(CANCEL_EDITING_AUTHOR, this.selectedAuthor.email);
    },
  },
  data: () => ({
    METADATA_AUTHORS_PROPERTY,
    EDIT_METADATA_ADD_AUTHOR_TITLE,
  }),
};
</script>

<style scoped>

</style>
