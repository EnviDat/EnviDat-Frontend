/**
 * @summary story for EditAuthorList component
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import {
  CANCEL_EDITING_AUTHOR,
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_DATACREDIT,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  REMOVE_EDITING_AUTHOR,
  SAVE_EDITING_AUTHOR,
  SELECT_EDITING_AUTHOR,
} from '@/factories/eventBus';

import EditAuthorList from '@/modules/user/components/edit/EditAuthorList.vue';

import {
  createAuthors,
  extractAuthorsMap,
  getAuthorName,
  getFullAuthorsFromDataset,
  mergeAuthorsDataCredit,
  mergeEditingAuthor,
} from '@/factories/authorFactory';

import { METADATA_AUTHOR_SEQUENCE_PROPERTY, METADATA_AUTHORS_PROPERTY } from '@/factories/metadataConsts';
import unFormatedMetadataCards from '@/../stories/js/metadata';

import { AuthorListViewModel } from '@/modules/workflow/viewModel/AuthorListViewModel.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { BackendDatasetService } from '@/modules/workflow/BackendDatasetService.ts';

const serviceLayer = new BackendDatasetService(unFormatedMetadataCards[0]);
const datasetVM = new DatasetModel(serviceLayer);

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  el.author = createAuthors(el);
  metadataCards.push(el);
});

const authorsMap = extractAuthorsMap(metadataCards);
const authorsObjs = getFullAuthorsFromDataset(authorsMap, metadataCards[1]);
// don't do it for now to disable Author Editing
// enhanceElementsWithStrategyEvents(authors, SELECT_EDITING_AUTHOR_PROPERTY);

// extract the names of the authors into a plain array of string for the baseUserPicker
const extractedAuthors = [];
const authorsStrings = [];
authorsObjs.forEach((author) => {
  extractedAuthors.push(author);
  authorsStrings.push(author.fullName);
});

const preSelectedAuthors2 = extractedAuthors.filter((value) => value.fullName.includes('B'));

export default {
  title: '3 Datasets / 2 Edit / Author Infos',
  component: EditAuthorList,
};

const Template = {
  render: (args, { argTypes }) => ({
    components: { EditAuthorList },
    props: Object.keys(argTypes),
    template: `<EditAuthorList v-bind="$props"
                               :authors="localAuthors"
                               :loading="storyLoading"
                />`,
    created() {
      eventBus.on(SAVE_EDITING_AUTHOR, this.saveAuthor);
      eventBus.on(SELECT_EDITING_AUTHOR, this.selectAuthor);
      eventBus.on(CANCEL_EDITING_AUTHOR, this.cancelEditing);
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.changeAuthors);
    },
    beforeMount() {
      this.localAuthors = this.authors;
    },
    beforeUnmount() {
      eventBus.off(SAVE_EDITING_AUTHOR, this.saveAuthor);
      eventBus.off(SELECT_EDITING_AUTHOR, this.selectAuthor);
      eventBus.off(CANCEL_EDITING_AUTHOR, this.cancelEditing);
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.changeAuthors);
    },
    methods: {
      removeAuthor(email) {
        const matches = this.localAuthors.filter((auth) => auth.email === email);

        console.log('remove Author');
        console.log(matches.length > 0);

        if (matches.length > 0) {
          const removeIndex = this.localAuthors.indexOf(matches[0]);
          this.localAuthors.splice(removeIndex, 1);

          console.log('remove index');
          console.log(removeIndex);
        }
      },
      selectAuthor(id) {
        if (this.selectionId !== '') {
          this.cancelEditing();
        }

        this.selectionId = id;
        this.setSelected(this.selectionId, true);
      },
      cancelEditing() {
        this.setSelected(this.selectionId, false);
        this.selectionId = '';
        eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);
      },
      setSelected(id, selected) {
        const auths = this.localAuthors;

        for (let i = 0; i < auths.length; i++) {
          const author = auths[i];
          if (author.email === id) {
            author.isSelected = selected;
            // this.$set(auths, i, author);
            return;
          }
        }
      },
      saveAuthor(newAuthor) {
        this.updateAuthors(newAuthor);
        this.cancelEditing();
      },
      updateAuthors(newAuthor) {
        const auths = this.localAuthors;

        for (let i = 0; i < auths.length; i++) {
          const r = auths[i];
          if (r.localId) {
            if (r.localId === newAuthor.localId) {
              auths[i] = newAuthor;
              //            this.$set(auths, i, newAuthor);
              return;
            }
          } else if (r.email === newAuthor.email) {
            auths[i] = newAuthor;
            //          this.$set(auths, i, newAuthor);
            return;
          }
        }

        auths.unshift(newAuthor);
      },
      changeAuthors(updateObj) {
        this.storyLoading = true;

        if (updateObj.object === EDITMETADATA_AUTHOR_DATACREDIT) {
          const authorToMergeDataCredit = updateObj.data;

          // overwrite the authors and stepKey so it will be saved as if it was a EDITMETADATA_AUTHOR_LIST change (to the list of authors)
          this.localAuthors = mergeAuthorsDataCredit(this.localAuthors, authorToMergeDataCredit);
        }

        if (updateObj.object === EDITMETADATA_AUTHOR_LIST) {
          this.localAuthors = updateObj.data.authors;
        }

        if (updateObj.object === EDITMETADATA_AUTHOR) {
          const updatedAuthor = updateObj.data;

          let changed = false;

          for (let i = 0; i < this.localAuthors.length; i++) {
            const auth = this.localAuthors[i];

            const email = auth.email;
            const fullName = auth.fullName;

            const searchAuthorFullName = getAuthorName({
              firstName: updatedAuthor.firstName,
              lastName: updatedAuthor.lastName,
            });

            if (email === updatedAuthor.email || fullName === searchAuthorFullName) {
              const mergedAuthor = mergeEditingAuthor(updatedAuthor, auth);

              // this.authors[i] = createAuthor(updatedAuthor);
              //  this.$set(this.localAuthors, i, mergedAuthor);
              this.localAuthors[i] = mergedAuthor;

              // use $set to make the author entry reactive
              // this.$set(this.authors, i, author);

              changed = true;
              console.log(`Updated author ${email} ${fullName}`);
              break;
            }
          }

          if (!changed) {
            this.localAuthors.push(updatedAuthor);

            this.selectAuthor(updatedAuthor.email);
            // this.$set(this.authors, this.authors.length - 1, updatedAuthor);
          }
        }

        if (updateObj.object === REMOVE_EDITING_AUTHOR) {
          this.removeAuthor(updateObj.data);
        }

        console.log('FullEditingAuthorView updated authors');
        console.log(this.localAuthors);

        setTimeout(() => {
          this.storyLoading = false;
          eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);
        }, 1000);
      },
    },
    data: () => ({
      storyLoading: false,
      selectionId: '',
      localAuthors: undefined,
    }),
  }),
};

export const EmptyAuthorList = {
  ...Template,
  args: {
    authors: undefined,
    existingAuthors: undefined,
    authorsMap: undefined,
  },
};

export const EditExistingAuthors = {
  ...Template,
  args: {
    authors: preSelectedAuthors2,
    existingAuthors: extractedAuthors,
    authorsMap,
  },
};

export const LoadingAuthorList = {
  args: {
    ...EditExistingAuthors.args,
    loading: true,
  },
};

const vm = datasetVM.getViewModel(AuthorListViewModel.name);

export const AuthorListViewModels = {
  args: {
    ...vm,
    onSave: (newData) => {
      vm.save(newData);
    },
  },
};

export const EditExistingAuthorsReadOnly = {
  args: {
    ...EditExistingAuthors.args,
    readOnlyFields: [METADATA_AUTHORS_PROPERTY, METADATA_AUTHOR_SEQUENCE_PROPERTY],
    readOnlyExplanation: 'Fields are readonly for testing!',
  },
};

export const EditLargeAuthorList = {
  ...Template,
  args: {
    authors: Object.values(authorsMap),
    existingAuthors: Object.values(authorsMap),
    authorsMap,
  },
};
