<template>
  <v-card id="MetadataAuthorsEditing" class="pa-0" :loading="loadingColor">
    <v-container fluid class="pa-4">
      <v-row>
        <v-col class="text-h5">
          {{ title }}
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-1" v-html="editingInstructions"> </v-col>
      </v-row>

      <v-row v-show="validationErrors.authors">
        <v-col
          :style="`background-color: ${$vuetify.theme.themes.light.colors.error}; `"
        >
          {{ validationErrors.authors }}
        </v-col>
      </v-row>

      <v-row align="center" class="pt-2">
        <v-col class="flex-grow-0 px-3 py-0">
          <BaseIcon :icon="mdiCursorMove" color="grey" />
        </v-col>

        <v-col class="text-h6 pa-0"> Author Sequence </v-col>
      </v-row>

      <v-row>
        <v-col>
          <ExpandableLayout
            statusText="Click here, drag and drop the authors to change the sequence."
            :startExpanded="authorFullNames?.length < 10"
            highlighted
            isFlat
          >
            <BaseDraggableList
              :items="authorFullNames"
              :useAuthorTags="true"
              :draggableProperty="METADATA_AUTHOR_SEQUENCE_PROPERTY"
              :readOnlyFields="readOnlyFields"
              :readOnlyExplanation="readOnlyExplanation"
              @listChanged="reorderList"
            />
          </ExpandableLayout>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <MetadataAuthors v-bind="metadataAuthorsObject">
            <template #editingAuthors="author">
              <AuthorCard
                v-bind="authorEditingProperties(author)"
                @openButtonClicked="catchEditAuthorClick(author)"
                @catchSearchAuthor="catchAuthorSearchClick"
              >
                <template #dataCreditCurrentDataset>
                  <EditDataCredits
                    v-bind="dataCreditProps(author)"
                    @creditClick="catchCreditClick(author, $event)"
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
import { mdiClose, mdiCursorMove, mdiPencil } from '@mdi/js';
import {
  AUTHORS_EDIT_CURRENT_DATACREDIT,
  EDIT_METADATA_AUTHORSLIST_TITLE,
  METADATA_AUTHOR_SEQUENCE_PROPERTY,
  METADATA_DATACREDIT_PROPERTY,
} from '@/factories/metadataConsts';

import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors.vue';
import AuthorCard from '@/modules/metadata/components/AuthorCard.vue';
import EditDataCredits from '@/modules/user/components/edit/EditDataCredits.vue';
import BaseDraggableList from '@/components/BaseElements/BaseDraggableList.vue';
import ExpandableLayout from '@/components/Layouts/ExpandableLayout.vue';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';

import { getAuthorName } from '@/factories/authorFactory';
import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus.js';

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
    validationErrors: {
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
  emits: ['save', 'editAuthorClick', 'searchAuthorClick'],
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
    authorFullNames() {
      if (!this.authorsFields) {
        return [];
      }

      return this.authorsFields.map((a) => getAuthorName(a));
    },
    authorsFields() {
      return this.previewAuthors || this.authors;
    },
    metadataAuthorsObject() {
      return {
        authors: this.authorsFields,
        authorDetailsConfig: this.authorDetailsConfig,
        emptyText:
          'No author has been added yet. Select authors in the dropdown or create a new author.',
        emptyTextColor: 'grey',
      };
    },
    authorEditingEnabled() {
      // loading in the config here?
      return true;
    },
  },
  methods: {
    reorderList(newList) {
      const newAuthors = [];

      for (let i = 0; i < newList.length; i++) {
        const fullName = newList[i];
        const author = this.authorsFields.filter(
          (a) => getAuthorName(a) === fullName,
        )[0];
        if (author) {
          newAuthors.push(author);
        }
      }

      this.previewAuthors = newAuthors;
      this.notifyChange();
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
    authorEditingProperties(authorObj) {
      let editingProperties = {};
      const author = authorObj?.author ? authorObj.author : authorObj;

      if (this.authorEditingEnabled) {
        editingProperties = {
          showGenericOpenButton: true,
          openButtonIcon: author?.isSelected ? mdiClose : mdiPencil,
          openButtonTooltip: author?.isSelected
            ? 'Cancel author editing'
            : 'Edit Author',
        };
      }

      return {
        author,
        ...editingProperties,
        overrideAuthorInfosExpanded: true,
        authorDetailsConfig: this.authorDetailsConfig,
      };
    },
    dataCreditProps(author) {
      return {
        instruction: AUTHORS_EDIT_CURRENT_DATACREDIT,
        dataCredit: author.dataCredit,
        authorName: author.fullName,
        readOnly:
          this.loading ||
          this.readOnlyFields?.includes(METADATA_DATACREDIT_PROPERTY),
      };
    },
    clearPreviews() {
      this.previewAuthors = null;
    },
    toggleDataCredit(author, creditName) {
      const dCredit = [...(author.dataCredit || [])];

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
      let localAuthorsCopy = [...this.authors];
      const authorToChange = localAuthorsCopy.filter(
        (a) => a.email === author.email,
      )[0];

      const authorCopy = { ...authorToChange };
      const newAuthor = this.toggleDataCredit(authorCopy, creditName);

      // replaces the existing author with the new one
      localAuthorsCopy = localAuthorsCopy.map((a) =>
        a.email !== newAuthor.email ? a : newAuthor,
      );

      this.previewAuthors = localAuthorsCopy;

      this.$emit('save', {
        authors: localAuthorsCopy,
      })
    },
    catchEditAuthorClick(author) {
      this.$emit('editAuthorClick', author);
    },
    catchAuthorSearchClick(fullName) {
      this.$emit('searchAuthorClick', fullName);
    },
  },
  data: () => ({
    METADATA_AUTHOR_SEQUENCE_PROPERTY,
    mdiCursorMove,
    editingInstructions:
      'Here is a preview list of the authors of this dataset. Edit the <a href="https://www.wsl.ch/datacredit/#feat" target="_blank">DataCRediT</a> contributions for each author directly in this list by clicking on the icons. For further editing of authors, select them with the edit icon. ',
    title: EDIT_METADATA_AUTHORSLIST_TITLE,
    previewAuthors: null,
  }),
  components: {
    BaseIcon,
    MetadataAuthors,
    AuthorCard,
    EditDataCredits,
    BaseDraggableList,
    ExpandableLayout,
  },
};
</script>

<style scoped></style>
