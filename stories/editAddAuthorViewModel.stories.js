/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import EditAddAuthor from '@/modules/user/components/EditAddAuthor.vue';

import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory.js';

import { AuthorsViewModel } from '@/factories/ViewModels/AuthorsViewModel';

import unFormatedMetadataCards from './js/metadata';
import { BackendDatasetService } from '@/modules/workflow/BackendDatasetService.ts';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';


const metadataCards = [];


const serviceLayer = new BackendDatasetService(unFormatedMetadataCards[0])
const datasetVM = new DatasetModel(serviceLayer);
const authorsViewModel = new AuthorsViewModel(datasetVM.dataset);


unFormatedMetadataCards.forEach((el) => {
  el.author = createAuthors(el);
  metadataCards.push(el);
});

const authorsMap = extractAuthorsMap(metadataCards);
const authorsObjs = getFullAuthorsFromDataset(authorsMap, metadataCards[1]);


export default {
  title: '3 Datasets / 2 Edit / Add New Author ViewModel',
  component: EditAddAuthor,
};


export const FilledFromViewModel = {
  args: {
    ...authorsViewModel.authors[1],
    existingAuthors: authorsObjs.values(),
  },
}


