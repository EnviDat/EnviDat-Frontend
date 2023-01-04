<template>
  <v-card id="EditMetadataResources"
          class="pa-0"
          :loading="loading" >

    <v-container fluid
                 class="pa-4" >

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row >
        <v-col class="text-h5" >
          {{ title }}
        </v-col>
      </v-row>

      <v-row >
        <v-col class="text-body-1"
                v-html="editingInstructions">
        </v-col>
      </v-row>

      <v-row v-show="validationErrors.authors">
        <v-col :style="`background-color: ${$vuetify.theme.themes.light.error}; `">
          {{ validationErrors.authors }}
        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12">
          <MetadataAuthors :genericProps="metadataAuthorsObject" >
            <template #editingAuthors="{ author }" >

              <AuthorCard v-bind="authorEditingProperties(author)"
                          @openButtonClicked="catchEditAuthorClick(author)"
                          @catchSearchAuthor="catchAuthorSearchClick"
                          >

                <template #dataCreditCurrentDataset >
                  <EditDataCredits :instruction="editDataCreditsInstruction"
                                   :dataCredit="author.dataCredit"
                                   :authorName="author.fullName"
                                   @creditClick="catchCreditClick(author, ...arguments)"
                                    />

                </template>

              </AuthorCard>
            </template>
          </MetadataAuthors>
        </v-col>
      </v-row>

    </v-container>

  </v-card>

</template>

<script>
/**
 * EditMetadataAuthors.vue shows all the authors of a metadata entry in a list to select
 * them for editing
 *
 * @summary shows the authors the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-09-01 11:00:41
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  AUTHORS_EDIT_CURRENT_DATACREDIT,
  EDIT_METADATA_AUTHORSLIST_TITLE,
} from '@/factories/metadataConsts';

import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors.vue';
import AuthorCard from '@/modules/metadata/components/AuthorCard.vue';
import EditDataCredits from '@/modules/user/components/edit/EditDataCredits.vue';

import {
  AUTHOR_SEARCH_CLICK,
  EDITMETADATA_AUTHOR_DATACREDIT,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';
import { getValidationMetadataEditingObject, isFieldValid } from '@/factories/userEditingValidations';

export default {
  name: 'EditMetadataAuthors',
  props: {
    authors: {
      type: Array,
      default: () => [],
    },
    authorDetailsConfig: {
      type: Object,
      default: () => {},
    },
    authorDeadInfo: {
      type: Object,
      default: () => {},
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    authorsFields() {
      const authors = this.previewAuthors || this.authors;

      if (authors?.length > 0) {
        for (let i = 0; i < authors.length; i++) {
          const author = authors[i];
          author.loading = this.loading;
        }
      }

      isFieldValid('authors', authors, this.validations, this.validationErrors)

      return authors;
    },
    metadataAuthorsObject() {
      return {
        authors: this.authorsFields,
        authorDetailsConfig: this.authorDetailsConfig,
        authorDeadInfo: this.authorDeadInfo,
        emptyText: 'No author has been added yet. Select authors in the dropdown or create a new author.',
        emptyTextColor: 'grey',
      };
    },
    authorEditingEnabled() {
      // loading in the config here?
      return true;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_AUTHOR_LIST);
    },
  },
  methods: {
    authorEditingProperties(author) {
      let editingProperties = {};

      if (this.authorEditingEnabled) {
        editingProperties = {
          showGenericOpenButton: true,
          openButtonIcon: author.isSelected ? 'close' : 'edit',
          openButtonTooltip: author.isSelected ? 'Cancel author editing' : 'Edit Author',
        };
      }

      return {
        author,
        ...editingProperties,
        overrideAuthorInfosExpanded: true,
        authorDetailsConfig: this.authorDetailsConfig,
        ...this.authorDeadInfo,
        /*
                  :asciiDead="authorDeadInfo ? authorDeadInfo.asciiDead : ''"
                  :authorPassedInfo="authorDeadInfo ? authorDeadInfo.authorPassedInfo : ''"
        */
      };
    },
    clearPreviews() {
      this.previewAuthors = null;
    },
    toggleDataCredit(author, creditName) {
      const dCredit = [...author.dataCredit || []];

      if (!dCredit.includes(creditName)) {
        dCredit.push(creditName);
      } else {
        const index = dCredit.indexOf(creditName);
        dCredit.splice(index, 1);
      }

      author.dataCredit = dCredit;

      return author;
    },
    catchCreditClick(author, creditName) {

      let localAuthorCopy = [...this.authors];
      const authorToChange = localAuthorCopy.filter(a => a.email === author.email)[0];

      const authorCopy = { ...authorToChange };
      const newAuthor = this.toggleDataCredit(authorCopy, creditName);

      // replaces the existing author with the new one
      localAuthorCopy = localAuthorCopy.map(a => a.email !== newAuthor.email ? a : newAuthor);

      this.previewAuthors = localAuthorCopy;

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_AUTHOR_DATACREDIT,
        data: newAuthor,
      });

    },
    catchEditAuthorClick(author) {
      this.$emit('editAuthorClick', author)
    },
    catchAuthorSearchClick(fullName) {
      eventBus.emit(AUTHOR_SEARCH_CLICK, fullName);
    },
  },
  data: () => ({
    editingInstructions: 'Here is a preview list of the authors of this dataset. Edit the <a href="https://www.wsl.ch/datacredit/#feat" target="_blank">DataCRediT</a> contributions for each author directly in this list by clicking on the icons. For further editing of authors, select them with the edit icon. ',
    title: EDIT_METADATA_AUTHORSLIST_TITLE,
    editDataCreditsInstruction: AUTHORS_EDIT_CURRENT_DATACREDIT,
    previewAuthors: null,
    validationErrors: {
      authors: '',
    },
  }),
  components: {
    MetadataAuthors,
    AuthorCard,
    EditDataCredits,
  },
};
</script>

<style scoped>

</style>
