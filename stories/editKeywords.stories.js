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

import EditKeywords from '@/modules/user/components/EditKeywords.vue';

import storyTags from '@/modules/metadata/store/metadataTags';
import categoryCards from '@/store/categoryCards';
import { getPopularTags, getTagColor } from '@/factories/keywordsFactory';
import metadataset from './js/metadata';
import { convertJSON } from '@/factories/mappingFactory.js';
import metadata from '~/stories/js/metadata.js';
import { EditKeywordsViewModel } from '@/factories/ViewModels/EditKeywordsViewModel';


const parsedDataset1 = convertJSON(metadata[2], false);
const tagsFromDatasets = getPopularTags(metadataset, '', 1);

for (let i = 0; i < tagsFromDatasets.length; i++) {
  const tag = tagsFromDatasets[i];
  tag.color = getTagColor(categoryCards, tag.name);
}

const editKeywordsViewModel = new EditKeywordsViewModel(parsedDataset1, tagsFromDatasets);
const parsedDataset2 = convertJSON(metadata[0], false);
const editKeywordsViewModel2 = new EditKeywordsViewModel(parsedDataset2, tagsFromDatasets);


function getKeywordsSource(tagsSource) {

  const keywordsArray = [...tagsSource];

  for (let i = 0; i < keywordsArray.length; i++) {
    keywordsArray[i].color = getTagColor(keywordsArray[i].name);
  }

  return keywordsArray;
}

const storyTags5 = getKeywordsSource(storyTags).slice(0, 5);


export default {
  title: '3 Datasets / 2 Edit / Keywords',
  component: EditKeywords,
};

export const Empty = {};

export const Filled = {
  args: {
    metadataTitle: 'A Mostly Glorious Title',
    metadataDescription: 'My metadata description is pleasant to read.',
    existingKeywords: tagsFromDatasets,
    keywords: storyTags5,
  },
}

export const FromViewModel = {
  args: {
    ...editKeywordsViewModel,
  },
}

export const ManyKeywords = {
  args: {
    ...editKeywordsViewModel2,
  },
}
