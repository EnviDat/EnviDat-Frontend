// noinspection JSUnusedGlobalSymbols
/* eslint-disable */
/* eslint-disable import/no-extraneous-dependencies */

/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 20:26:06
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import MetadataDescription from '@/modules/metadata/components/Metadata/MetadataDescription.vue';

import { createDescriptionViewModel } from '@/factories/ViewModels/DescriptionViewModel.js';
import { convertJSON } from '@/factories/mappingFactory';
import { enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';

import metadata from './js/metadata';
import { toRefs } from 'vue';

export default {
  title: '3 Dataset / 1 Views / Metadata Description',
  component: MetadataDescription,
};

enhanceMetadatasTitleImage(metadata);

const parsedContent = convertJSON(metadata[0], false);
const parsedContent2 = convertJSON(metadata[3], false);

const descVM1 = createDescriptionViewModel(parsedContent, true);
const descVM2 = createDescriptionViewModel(parsedContent2, false, (newModel) => {
  console.log('changed descVM2.description after timeout', newModel);
});

export const Empty = {}

export const Loading = {
  args: {
    showPlaceholder: true,
  },
}

export const Filled = {
  args: {
    ...toRefs(descVM1),
  },
}

export const Filled2Updated = {
  args: {
    ...toRefs(descVM2),
  },
}

setTimeout(() => {
  descVM2.description = 'updated description to test reactivity, if you see this it worked!';
}, 2000)
