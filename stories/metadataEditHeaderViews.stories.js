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
import { sortObjectArray } from '@/factories/metaDataFactory';

import {
  createAuthors,
  getFullAuthorsFromDataset,
  extractAuthorsMap,
} from '@/factories/authorFactory';


import categoryCards from '@/store/categoryCards';
import { getPopularTags, getTagColor } from '@/factories/keywordsFactory';

import { mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
import metadataset from './js/metadata';

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


export default {
  title: '3 Dataset / 2 Edit / Metadata Header',
  component: EditMetadataHeader,
};

const emptyFirstGenericProps = {
  id: '1',
  existingAuthors,
  metadataTitle: '',
  contactEmail: '',
  contactGivenName: '',
  contactSurname: '',
  existingEnviDatUsers: authors,
};

export const EmptyEditHeader = {
  args: emptyFirstGenericProps,
};

const filledGenericProps = {
  id: '2',
  existingAuthors,
  metadataTitle: 'My Glorious Title',
  contactEmail: 'sarah@smith.com',
  contactGivenName: 'Sarah',
  contactSurname: 'Miller',
};

export const FilledEditHeader = {
  args: filledGenericProps,
};

const filledProps2 = {
  id: '3',
  existingAuthors,
  metadataTitle: 'My Glorious Title',
  contactEmail: existingAuthors[3].email,
  contactGivenName: existingAuthors[3].firstName,
  contactSurname: existingAuthors[3].lastName,
};

export const FilledWithExistingAuthor = {
  args: filledProps2,
};


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
