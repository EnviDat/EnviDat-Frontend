<template>
  <v-container id="AuthorsInformation" fluid class="pa-4">
    <v-row class="mb-0">
      <v-col class="text-h5 font-weight-bold" cols="12">
        {{ labels.title }}
      </v-col>
      <!-- <v-col cols="12" class="text-body-1"> {{ labels.instructions }} </v-col> -->
    </v-row>

    <!-- Info Banner -->
    <v-row>
      <v-col class="mb-5 pt-0 pb-0">
        <v-alert
          type="info"
          closable
          :icon="false"
          class="rounded-lg info-banner"
        >
          <v-alert-title class="mb-2">Information </v-alert-title>

          <p>
            This section allows you to manage the authors of your dataset.
            Adding accurate author information helps ensure proper attribution
            and visibility.
          </p>

          <p><strong>Tips:</strong></p>
          <ol>
            <li>
              - To add an existing EnviDat author, start typing their name in
              the field and select from the list.
            </li>
            <li>
              - To create a new author, provide their email address first. If
              the author already exists, their details will be filled in
              automatically.
            </li>
            <li>
              - Fill in all relevant fields such as first name, last name,
              affiliation, and OrcID for completeness.
            </li>
            <li>
              - Drag and drop authors in the preview list to change their order
              of appearance.
            </li>
          </ol>

          <p class="mt-2">
            Make sure to include <strong>at least one author</strong> before
            proceeding to the next step.
          </p>
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6" class="mb-5">
        <v-row>
          <v-col v-show="!selectedAuthor" cols="12">
            <AddExistingAuthor
              v-bind="authorPickingGenericProps"
              @save="saveAuthorsList"
            />
          </v-col>

          <v-col v-if="isReadOnly('authorsWrapper')" cols="12">
            <v-card class="rounded-lg pa-6">
              <v-row>
                <v-col>
                  <div class="font-weight-bold">
                    {{ EDIT_METADATA_ADD_AUTHOR_TITLE }}
                  </div>
                  <div class="text-caption text-bold">
                    {{ readOnlyHint('authorsWrapper') }}
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col v-else cols="12">
            <AddNewAuthor
              v-bind="editAddAuthorObject"
              @removeAuthor="catchRemoveAuthor"
              @closeClicked="catchEditAuthorClose"
              @validate="validateAuthor"
              @save="saveAuthor"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="6">
        <MetadataAuthorsEditing
          v-bind="authorListingGenericProps"
          @editAuthorClick="catchEditAuthorClick"
          @searchAuthorClick="catchSearchAuthorClick"
          @save="saveAuthorsList"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/**
 * AuthorsInformation.vue shows all the authors of a metadata entry in a list.
 *
 * @summary shows the authors of a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2025-06-05 14:11:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import type { Author } from '@/types/modelTypes';
import AddNewAuthor from '@/modules/workflow/components/steps/AddNewAuthor.vue';
import AddExistingAuthor from '@/modules/workflow/components/steps/AddExistingAuthor.vue';
import MetadataAuthorsEditing from '@/modules/workflow/components/steps/MetadataAuthorsEditing.vue';

import {
  enhanceAuthorsFromAuthorMap,
  getAuthorName,
} from '@/factories/authorFactory';

import {
  AUTHOR_SEARCH_CLICK,
  EDITMETADATA_CLEAR_PREVIEW,
  eventBus,
} from '@/factories/eventBus';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import {
  EDIT_METADATA_ADD_AUTHOR_TITLE,
  METADATA_AUTHORS_PROPERTY,
} from '@/factories/metadataConsts';

import { AuthorViewModel } from '@/modules/workflow/viewModel/AuthorViewModel.ts';
import { updateEditingArray } from '@/factories/userEditingFactory';

import {
  isReadOnlyField,
  getReadOnlyHint,
} from '@/modules/workflow/utils/useReadonly';


export default {
  name: 'AuthorsInformation',
  components: {
    MetadataAuthorsEditing,
    AddNewAuthor,
    AddExistingAuthor,
  },
  props: {
    existingAuthors: {
      type: Array,
      default: undefined,
    },
    authors: {
      type: Array, // as PropType<Author>,
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
    validationErrors: {
      type: Object,
      default: () => ({}),
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
      const authors = this.authors;

      /*
      if (!authors && this.$store) {
        authors = this.$store.getters[`${USER_NAMESPACE}/authors`] || [];
      }
*/

      if (!authors) {
        return undefined;
      }

      const authorsMap = this.authorsMapWrap;
      return enhanceAuthorsFromAuthorMap(authors, authorsMap);
    },
    noDataCreditAuthorsWrap() {
      const authors = this.existingAuthorsWrap
        ? [...this.existingAuthorsWrap]
        : [];

      for (let i = 0; i < authors.length; i++) {
        authors[i] = {
          ...authors[i],
          dataCredit: [],
        };
      }

      return authors;
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
        validationErrors: this.validationErrors,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    selectedAuthor() {
      return this.authors?.filter((r: Author) => r.isSelected)[0];
    },
    editAddAuthorObject() {
      if (!this.selectedAuthor) {
        return {
          ...this.authorViewModel,
          existingAuthors: this.noDataCreditAuthorsWrap,
          readOnlyFields: this.readOnlyFields,
          readOnlyExplanation: this.readOnlyExplanation,
        };
      }

      return {
        titleLabel: `Editing ${getAuthorName(this.selectedAuthor)}`,
        isEditingAuthor: !!this.selectedAuthor,
        existingAuthors: this.noDataCreditAuthorsWrap,
        ...this.authorViewModel,
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
  },
  methods: {
    isReadOnly(dateProperty) {
      return isReadOnlyField(dateProperty);
    },
    readOnlyHint(dateProperty) {
      return getReadOnlyHint(dateProperty);
    },
    markAuthorSelected(authors: Author[], email: string, isSelected: boolean) {
      const authorToMark = authors.filter(
        (author) => author.email === email,
      )[0];
      if (authorToMark) {
        authorToMark.isSelected = isSelected;
      }
    },
    catchEditAuthorClick(author: Author) {
      // clear the internal state of the UI component in case there was an input
      // on the adding of a new author
      eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

      if (this.selectedAuthor) {
        this.removeCurrentAuthorSelection();
      }

      this.markAuthorSelected(this.authors, author.email, !author.isSelected);
      this.authorViewModel.validate(author);
    },
    removeCurrentAuthorSelection() {
      if (this.selectedAuthor) {
        this.selectedAuthor.isSelected = false;
        this.resetAuthorViewModel();
      }
    },
    catchEditAuthorClose() {
      if (this.selectedAuthor) {
        this.removeCurrentAuthorSelection();
      }
    },
    catchSearchAuthorClick(fullName: string) {
      eventBus.emit(AUTHOR_SEARCH_CLICK, fullName);
    },
    catchRemoveAuthor(email: string) {
      if (this.selectedAuthor) {
        this.removeCurrentAuthorSelection();
      }

      const currentAuthors = [...this.authors];

      const matches = currentAuthors.filter(
        (auth: Author) => auth.email === email,
      );
      if (matches.length > 0) {
        const removeIndex = currentAuthors.indexOf(matches[0]);
        currentAuthors.splice(removeIndex, 1);

        this.saveAuthorsList({ authors: currentAuthors });
      }
    },
    saveAuthorsList(data: { authors: Author[] }) {
      this.$emit('save', data);
    },
    validateAuthor(data: { author: Author }) {
      this.authorViewModel.validate(data);
    },
    async editAuthor(author: Author) {
      const validData = this.authorViewModel.validate(author);

      if (validData) {
        const updatedAuthors = updateEditingArray(
          this.authors,
          author,
          'email',
        );

        this.saveAuthorsList({ authors: updatedAuthors });

        this.resetAuthorViewModel();
      }
    },
    saveAuthor(data: { author: Author }) {
      if (this.selectedAuthor) {
        this.editAuthor(data.author);
      } else {
        this.saveNewAuthor(data.author);
      }
    },
    async saveNewAuthor(author: Author) {
      // call the save here to do validation, don't directly call validate()
      // because if it's valid, we need to call getAuthor() which means the
      // viewModel has to have the author information assigned, which doesn't happen
      // when only validating
      const validData = await this.authorViewModel.validate(author);

      if (validData) {
        const newAuthor = this.authorViewModel.getModelData<Author>();
        const currentAuthors = [...this.authors];
        currentAuthors.push(newAuthor);

        this.saveAuthorsList({ authors: currentAuthors });

        this.resetAuthorViewModel();
      }
    },
    resetAuthorViewModel() {
      // clear the internal state of the UI component
      eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

      this.authorViewModel = new AuthorViewModel();
    },
  },
  data: () => ({
    authorViewModel: new AuthorViewModel(),
    METADATA_AUTHORS_PROPERTY,
    EDIT_METADATA_ADD_AUTHOR_TITLE,
    labels: {
      title: 'Authors Information',
      instructions: 'Please provide the authors of the dataset.',
    },
  }),
};
</script>

<style scoped></style>
