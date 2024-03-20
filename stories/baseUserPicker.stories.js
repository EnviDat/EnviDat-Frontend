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
const preSelectedAuthors2 = extractedAuthors.filter(value => value.fullName.includes('A'));
const preSelectedAuthors3 = authorsStrings.filter(value => value.includes('B'));


export default {
  title: '1 Base Elements / User Picker',
  decorators: [],
  parameters: {},
};

export const UserPickerViews = () => ({
  components: { BaseUserPicker },
  template: `
  <v-col>

    <v-row>
      BaseUserPicker
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <BaseUserPicker :users="authors" />
      </v-col>
    </v-row>

    <v-row>
      BaseUserPicker with preSelection
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <BaseUserPicker :users="authors"
                        :preSelected="preSelectedAuthor" />
      </v-col>
    </v-row>

    <v-row>
      BaseUserPicker as Card with multiple-pick, clearable and instructions
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <BaseUserPicker :users="authors"
                        :multiplePick="true"
                        :isClearable="true"
                        :showAsCard="true"
                        instructions="Pick an EnviDat user to add as an author." />
      </v-col>
    </v-row>

    <v-row>
      BaseUserPicker with multiple-pick and clearable and with pre selection
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <BaseUserPicker :users="authors"
                        :multiplePick="true"
                        :preSelected="preSelectedAuthors3"
                        :isClearable="true" />
      </v-col>
    </v-row>

    <v-row>
      BaseUserPicker read only with pre selection
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <BaseUserPicker :users="authors"
                        :multiplePick="true"
                        :preSelected="preSelectedAuthors3"
                        :readonly="true"
                        hint="Testing readonly" />
      </v-col>
    </v-row>

  </v-col>
  `,
  methods: {
  },
  data: () => ({
    authors: authorsStrings,
    preSelectedAuthor,
    preSelectedAuthors3,
  }),
});
