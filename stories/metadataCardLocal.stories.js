/**
 * @summary story of MetadataCard & MetadataCardPlaceholder for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-04 11:39:07
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataCardLocal from '@/components/Cards/MetadataCardLocal.vue';

import { enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';

import { METADATA_STATE_DRAFT } from '@/factories/metadataConsts';

// metadata gets enhanced in the storybook config
import metadataCards from './js/metadata';

enhanceMetadatasTitleImage(metadataCards);

export default {
  title: '3 Cards / Metadata Cards',
  component: MetadataCardLocal,
};

const firstDataset = metadataCards[0];

export const LocalCardNoTitle = {};

export const LocalCard = {
  args: {
    id: firstDataset.id,
    title: firstDataset.title,
    categoryColor: firstDataset.categoryColor,
    name: firstDataset.name,
    subtitle: firstDataset.notes,
    state: METADATA_STATE_DRAFT,
  },
};

