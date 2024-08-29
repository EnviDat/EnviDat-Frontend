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

import { envidatViewportParameters, mobileLargeViewportParams, mobileViewportParams, tabletViewportParams } from './js/envidatViewports';
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
  title: '9 Editing Metadata / Metadata Header Views',
  decorators: [],
  parameters: {
    ...envidatViewportParameters,
  },
};


const EditMetadataHeaderTemplate = (args, { argTypes }) => ({
  components: { EditMetadataHeader },
  props: Object.keys(argTypes),
  template: '<EditMetadataHeader v-bind="$props" />',
});

const emptyFirstGenericProps = {
  id: '1',
  existingAuthors,
  metadataTitle: '',
  contactEmail: '',
  contactGivenName: '',
  contactSurname: '',
  existingEnviDatUsers: authors,
};

export const EmptyEditHeader = EditMetadataHeaderTemplate.bind({});
EmptyEditHeader.args = { ...emptyFirstGenericProps }

const filledGenericProps = {
  id: '2',
  existingAuthors,
  metadataTitle: 'My Glorious Title',
  contactEmail: 'sarah@smith.com',
  contactGivenName: 'Sarah',
  contactSurname: 'Miller',
};

export const FilledEditHeader = EditMetadataHeaderTemplate.bind({});
FilledEditHeader.args = { ...filledGenericProps }

export const MobileFilledEditHeader = EditMetadataHeaderTemplate.bind({});
MobileFilledEditHeader.args = { ...FilledEditHeader.args }
MobileFilledEditHeader.parameters = mobileViewportParams;

export const MobileLargeFilledEditHeader = EditMetadataHeaderTemplate.bind({});
MobileLargeFilledEditHeader.args = { ...FilledEditHeader.args };
MobileLargeFilledEditHeader.parameters = mobileLargeViewportParams;

export const TabletFilledEditHeader = EditMetadataHeaderTemplate.bind({});
TabletFilledEditHeader.args = { ...FilledEditHeader.args };
TabletFilledEditHeader.parameters = tabletViewportParams;
