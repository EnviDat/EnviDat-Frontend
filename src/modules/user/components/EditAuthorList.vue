<template>

  <v-container fluid
               class="pa-0"
               id="EditAuthorList" >

    <v-row >
      <v-col cols="6" >

        <v-row >
          <v-col cols="12">

              <EditAddExistingAuthor v-bind="authorPickingGenericProps" />
          </v-col>

          <v-col cols="12">

              <EditAddAuthor v-bind="selectedAuthorObj"
                             @closeClicked="catchEditAuthorClose"
                             @saveAuthor="catchSaveAuthorClose" />
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

import EditAddAuthor from '@/modules/user/components/EditAddAuthor';
import EditAddExistingAuthor from '@/modules/user/components/EditAddExistingAuthor';
import EditMetadataAuthors from '@/modules/user/components/EditMetadataAuthors';

import {
  getAuthorName,
  initializeLocalAuthor,
} from '@/factories/authorFactory';

import {
  localIdProperty,
} from '@/factories/strategyFactory';
import {
  CANCEL_EDITING_AUTHOR,
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  SAVE_EDITING_AUTHOR,
  SELECT_EDITING_AUTHOR,
} from '@/factories/eventBus';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';


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
      default: () => [],
    },
    authors: {
      type: Array,
      default: () => [],
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
    existingAuthorsWrap() {
      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingAuthors`];
      }

      return this.existingAuthors;
    },
    authorsWrap() {
      if (this.$store) {
        return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_AUTHOR_LIST).authors;
      }

      return this.authors;
    },
    noDataCreditAuthorsWrap() {
      const authors = [...this.existingAuthorsWrap];

      for (let i = 0; i < authors.length; i++) {
        authors[i] = {
          ...authors[i],
          dataCredit: [],
        }
      }

      return authors
    },
/*
    authorsMapWrap() {
      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/authorsMap`];
      }

      return this.authorsMap;
    },
    authorsMapLoading() {
      if (!this.$store) {
        return false;
      }

      return this.authorsMapWrap === null;
    },
*/
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
          showDatasetCount: false,
          showAuthorInfos: true,
          showDataCredits: false,
          showDataCreditScore: false,
        },
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
    selectedAuthorObj() {
      if (!this.selectedAuthor) {
        return {
          existingAuthors: this.noDataCreditAuthorsWrap,
        };
      }

      return {
        titleLabel: `Editing ${getAuthorName(this.selectedAuthor)}`,
        showCloseButton: !!this.selectedAuthor,
        existingAuthors: this.noDataCreditAuthorsWrap,
        email: this.selectedAuthor.email,
        firstName: this.selectedAuthor.firstName,
        lastName: this.selectedAuthor.lastName,
        affiliation: this.selectedAuthor.affiliation,
        orcId: this.selectedAuthor.identifier,
      };
    },
  },
  methods: {
    catchEditAuthorClick(author) {
      if (author.isSelected) {
        eventBus.$emit(CANCEL_EDITING_AUTHOR, author.email);
      } else {
        eventBus.$emit(SELECT_EDITING_AUTHOR, author.email);
      }
    },
    catchEditAuthorClose() {
      eventBus.$emit(CANCEL_EDITING_AUTHOR, this.selectedAuthor.email);
    },
    catchSaveAuthorClose() {
      eventBus.$emit(SAVE_EDITING_AUTHOR, this.selectedAuthor);
    },
  },
  data: () => ({
  }),
};
</script>

<style scoped>

</style>
