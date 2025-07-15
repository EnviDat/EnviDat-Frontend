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

import { reactive } from 'vue';
import type { Meta } from '@storybook/vue3-vite';

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader.vue';
import { sortObjectArray } from '@/factories/metaDataFactory';

import {
  createAuthors,
  getFullAuthorsFromDataset,
  extractAuthorsMap,
} from '@/factories/authorFactory';

import categoryCards from '@/store/categoryCards';
import { getPopularTags, getTagColor } from '@/factories/keywordsFactory';

import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY, METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';

import { EditDatasetServiceLayer } from '@/factories/ViewModels/EditDatasetServiceLayer';
import { EditHeaderViewModel } from '@/factories/ViewModels/EditHeaderViewModel';
import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

import metadataset from './js/metadata';


const serviceLayer = new EditDatasetServiceLayer(metadataset[0]);
const datasetVM = new DatasetModel(serviceLayer);


const unFormatedMetadataCards = metadataset;
const tagsFromDatasets = getPopularTags(metadataset, '', 1);

for (let i = 0; i < tagsFromDatasets.length; i++) {
  const tag = tagsFromDatasets[i];
  tag.color = getTagColor(categoryCards, tag.name);
}

const metadataCards = [];

for (let i = 0; i < unFormatedMetadataCards.length; i++) {
  const el = unFormatedMetadataCards[i];
  el.author = createAuthors(el);
  metadataCards.push(el);
}


const authorsMap = extractAuthorsMap(metadataCards);
const authors = getFullAuthorsFromDataset(authorsMap, metadataCards[1]);

let existingAuthors = Object.values(authorsMap);
existingAuthors = sortObjectArray(existingAuthors, 'lastName');

const serviceLayer2 = new EditDatasetServiceLayer(metadataset[1]);
const datasetVM2 = new DatasetModel(serviceLayer2);
const reactiveViewModelWithErrors = datasetVM2.getViewModel('EditHeaderViewModel');

export default {
  title: '3 Datasets / 2 Edit / Metadata Header',
  component: EditMetadataHeader,
} satisfies Meta<typeof EditMetadataHeader>;

const emptyFirstGenericProps = {
  id: '1',
  existingAuthors,
  metadataTitle: '',
  [METADATA_CONTACT_EMAIL]: '',
  [METADATA_CONTACT_FIRSTNAME]: '',
  [METADATA_CONTACT_LASTNAME]: '',
  existingEnviDatUsers: authors,
};

export const EmptyEditHeader = {
  args: emptyFirstGenericProps,
};

const filledGenericProps = {
  id: '2',
  existingAuthors,
  metadataTitle: 'My Glorious Title',
  [METADATA_CONTACT_EMAIL]: 'sarah@smith.com',
  [METADATA_CONTACT_FIRSTNAME]: 'Sarah',
  [METADATA_CONTACT_LASTNAME]: 'Miller',
};

export const FilledEditHeader = {
  args: filledGenericProps,
};

const filledProps2 = {
  id: '3',
  existingAuthors,
  metadataTitle: 'My Glorious Title',
  [METADATA_CONTACT_EMAIL]: existingAuthors[3].email,
  [METADATA_CONTACT_FIRSTNAME]: existingAuthors[3].firstName,
  [METADATA_CONTACT_LASTNAME]: existingAuthors[3].lastName,
};

export const FilledWithExistingAuthor = {
  args: filledProps2,
};

export const FilledAndReadOnly = {
  args: {
    ...filledProps2,
    readOnlyFields: [
      METADATA_TITLE_PROPERTY,
      METADATA_URL_PROPERTY,
      METADATA_CONTACT_EMAIL,
      METADATA_CONTACT_FIRSTNAME,
      METADATA_CONTACT_LASTNAME,
    ],
    readOnlyExplanation: 'Fields are readonly for testing!',
  },
};

const empty = new EditHeaderViewModel(new DatasetModel());
const emptyVM = reactive(empty);

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

export const FilledWithViewModelErrors = {
  args: {
    ...reactiveViewModelWithErrors,
    onSave: (newData) => {
      reactiveViewModelWithErrors.save(newData);
    },
  },
};

reactiveViewModelWithErrors.validate();

export const MobileFilledEditHeader = {
  args: { ...FilledEditHeader.args },
  parameters: mobileViewportParams,
};


export const MobileLargeFilledEditHeader = {
  args: {...FilledEditHeader.args},
  parameters: mobileLargeViewportParams,
};

export const TabletFilledEditHeader = {
  args: {...FilledEditHeader.args},
  parameters: tabletViewportParams,
};
