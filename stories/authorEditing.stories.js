/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

import unFormatedMetadataCards from './js/metadata';
import { EditDatasetServiceLayer } from '@/factories/ViewModels/EditDatasetServiceLayer';
import { DatasetViewModel } from '@/factories/ViewModels/DatasetViewModel';
import AuthorEditing from '@/modules/workflow/components/steps/AuthorEditing.vue';
import { EditAuthorViewModel } from '@/factories/ViewModels/EditAuthorViewModel.js';


const metadataCards = [];


const serviceLayer = new EditDatasetServiceLayer(unFormatedMetadataCards[0])
const datasetVM = new DatasetViewModel(serviceLayer);


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

const preSelectedAuthors2 = extractedAuthors.filter(value => value.fullName.includes('A'))[0];


export default {
  title: '6 Workflows / Combined / Author Editing',
  component: AuthorEditing,
};

export const Empty = {
  args: {
    existingAuthors: extractedAuthors,
  },
}

export const Loading = {
  args: {
    ...Empty.args,
    loading: true,
  },
}

const authorListVM = datasetVM.getViewModel('EditAuthorListViewModel');
const authorVMs = authorListVM.getEditAuthorViewModels(true);
const authorVM = authorVMs[0];
const authorVM2 = authorVMs[1];
authorVM2.loading = true;

export const Filled = {
  args: {
    ...authorVM,
    onSave: (newData) => {
      authorVM.save(newData);
    },
  },
}

export const FilledAndLoading = {
  args: {
    ...authorVM2,
    onSave: (newData) => {
      authorVM2.save(newData);
    },
  },
}
