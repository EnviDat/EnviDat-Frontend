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

import MetadataAuthors from '@/modules/metadata/components/Metadata/MetadataAuthors.vue';
import { Dataset } from '@/factories/ViewModels/Dataset';
import { AuthorsViewModel } from '@/factories/ViewModels/AuthorsViewModel';
import { enhanceMetadatasTitleImage } from '@/factories/metaDataFactory';

import {
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

import metadata from './js/metadata';

import metadataset from '~/stories/js/metadata.js';

export default {
  title: '3 Datasets / 1 Views / Authors',
  component: MetadataAuthors
};

enhanceMetadatasTitleImage(metadata);


const authorsMap = extractAuthorsMap(metadata);
const fullAuthors = getFullAuthorsFromDataset(authorsMap, metadata[1]);

const dataset = new Dataset(metadataset[0]);
const authorsViewModel = new AuthorsViewModel(dataset);

export const Empty = {};

export const WithPlaceholders = {
  args: {
    authors: [],
    showPlaceholder: true,
  },
}

export const Filled = {
  args: {
    showPlaceholder: false,
    authors: fullAuthors,
    authorDetailsConfig: {
      showAuthorInfos: true,
      showDataCredits: true,
      showDataCreditScore: false,
      showDatasetCount: false,
    },
  },
}

export const FromViewModel = {
  args: {
    ...authorsViewModel,
    authorDetailsConfig: {
      showAuthorInfos: true,
      showDataCredits: true,
      showDataCreditScore: false,
      showDatasetCount: true,
    },
  },
}
