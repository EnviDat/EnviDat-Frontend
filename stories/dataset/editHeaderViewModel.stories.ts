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

import categoryCards from '@/store/categoryCards';
import { getPopularTags, getTagColor } from '@/factories/keywordsFactory';

import metadataset from '@/../stories/js/metadata';
import { MetadataBaseViewModel } from '../../src/modules/workflow/viewModel/MetadataBaseViewModel';

const tagsFromDatasets = getPopularTags(metadataset, '', 1);

for (let i = 0; i < tagsFromDatasets.length; i++) {
  const tag = tagsFromDatasets[i];
  tag.color = getTagColor(categoryCards, tag.name);
}

const emptyVM = new MetadataBaseViewModel(undefined, undefined);
const reactiveViewModelWithErrors = new MetadataBaseViewModel(metadataset[2], undefined);

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

export const EmptyWithViewModel = {
  args: {
    ...emptyVM,
    onSave: (newData: any) => {
      emptyVM.save(newData);
    },
  },
};

const FilledVm = new MetadataBaseViewModel(metadataset[1], undefined);

export const FilledWithViewModel = {
  args: {
    ...FilledVm,
    onSave: (newData: any) => {
      FilledVm.save(newData);
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
