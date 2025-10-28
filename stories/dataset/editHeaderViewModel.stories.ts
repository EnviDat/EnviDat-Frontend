/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-06 15:11:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader.vue';

/*
import {
  createAuthors,
  getFullAuthorsFromDataset,
  extractAuthorsMap,
} from '@/factories/authorFactory';
*/

import categoryCards from '@/store/categoryCards';
import { getPopularTags, getTagColor } from '@/factories/keywordsFactory';

import { LocalStorageDatasetService } from '@/modules/workflow/LocalStorageDatasetService.ts';

import metadataset from '@/../stories/js/metadata';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

const tagsFromDatasets = getPopularTags(metadataset, '', 1);

for (let i = 0; i < tagsFromDatasets.length; i++) {
  const tag = tagsFromDatasets[i];
  tag.color = getTagColor(categoryCards, tag.name);
}

/*
const unFormatedMetadataCards = metadataset;
const metadataCards = [];

for (let i = 0; i < unFormatedMetadataCards.length; i++) {
  const el = unFormatedMetadataCards[i];
  el.author = createAuthors(el);
  metadataCards.push(el);
}

const authorsMap = extractAuthorsMap(metadataCards);

let existingAuthors = Object.values(authorsMap);
existingAuthors = sortObjectArray(existingAuthors, 'lastName');
*/

const serviceLayer2 = new LocalStorageDatasetService();
const datasetVM2 = new DatasetModel(serviceLayer2);
const reactiveViewModelWithErrors = datasetVM2.getViewModel('MetadataBaseViewModel');

export default {
  title: '3 Datasets / 2 Edit / Metadata Header',
  component: EditMetadataHeader,
}; // satisfies Meta<typeof EditMetadataHeader>;

/*
const watcherMethod = watch(() => emptyVM, async (newModel) => {
    newModel.loading = true;
    setTimeout(() => {
      newModel.loading = false;
    }, 2000)
  },
  { deep: true },
);
*/

/*
export const EmptyWithViewModel = {
  args: {
    ...emptyVM,
    onSave: (newData: any) => {
      emptyVM.save(newData);
    },
  },
};

const vm = datasetVM.getViewModel(EditHeaderViewModel.name);

export const FilledWithViewModel = {
  args: { 
    ...vm,
    onSave: (newData: any) => {
      vm.save(newData);
    },
  },
};
*/

export const FilledWithViewModelErrors = {
  args: {
    ...reactiveViewModelWithErrors,
    onSave: (newData) => {
      reactiveViewModelWithErrors.save(newData);
    },
  },
};

reactiveViewModelWithErrors.validate();
