/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */


import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';

import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

import unFormatedMetadataCards from './js/metadata';

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  el.author = createAuthors(el);
  metadataCards.push(el);
});

const authorsMap = extractAuthorsMap(metadataCards);
const authorsObjs = getFullAuthorsFromDataset(authorsMap, metadataCards[1]);
// don't do it for now to disable Author Editing
// enhanceElementsWithStrategyEvents(authors, SELECT_EDITING_AUTHOR_PROPERTY);

// extract the names of the authors into a plain array of string for the baseUserPicker
const extractedAuthors = [];
const authorsStrings = [];
authorsObjs.forEach((author) => {
  extractedAuthors.push(author);
  authorsStrings.push(author.fullName);
});

const preSelectedAuthor = authorsStrings.filter(value => value.includes('Fischer'));
// const preSelectedAuthors2 = extractedAuthors.filter(value => value.fullName.includes('A'));
const preSelectedAuthors3 = authorsStrings.filter(value => value.includes('B'));


export default {
  title: '1 Base Elements / User Picker',
  component: BaseUserPicker,
};


export const AuthorPicking = {
  args: {
    users: authorsStrings,
  },
}

export const WithPreselection = {
  args: {
    users: authorsStrings,
    preSelected: preSelectedAuthor,
  },
}

export const WithMultiplePick = {
  args: {
    users: authorsStrings,
    multiplePick: true,
    isClearable: true,
    showAsCard: true,
    instructions: 'Pick an EnviDat user to add as an author.',
  },
}

export const MultiplePickPreselection = {
  args: {
    ...WithMultiplePick.args,
    users: authorsStrings,
    preSelected: preSelectedAuthors3,
  },
}

export const MultiplePickReadonly = {
  args: {
    ...MultiplePickPreselection.args,
    readonly: true,
    hint: 'Testing readonly',
  },
}
