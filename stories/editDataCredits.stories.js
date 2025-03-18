/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import EditDataCredits from '@/modules/user/components/edit/EditDataCredits.vue';

import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

import { AUTHORS_EDIT_CURRENT_DATACREDIT } from '@/factories/metadataConsts';
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


export default {
  title: '3 Datasets / 2 Edit / Data Credits',
  component: EditDataCredits,
};



export const EditingDataCreditViews = () => ({
  components: { EditDataCredits },
  template: `
  <v-col>

    <v-row>
      empty EditDataCredits with defaults
    </v-row>

    <v-row class="py-3" >
      <v-col style="background-color: darkgrey;">
        <EditDataCredits @creditClick="catchCreditClick(emptyAuthor, $event)"
                         :dataCredit="emptyAuthor.dataCredit"
                         authorName="Dominik Haas-Artho"
                         :dark="true"
                        />
      </v-col>
    </v-row>

    <v-row>
      EditDataCredits
    </v-row>

    <v-row class="py-3" >
      <v-col style="background-color: gray;">
        <EditDataCredits :instruction="instruction"
                         :dataCredit="author.dataCredit"
                         authorName="Dominik Haas-Artho"
                          @creditClick="catchCreditClick(author, $event)"
                         :dark="true"
                          />
      </v-col>
    </v-row>

    <v-row>
      EditDataCredits dark
    </v-row>

    <v-row class="py-3" >
      <v-col style="background-color: greenyellow;">
        <EditDataCredits :instruction="instruction"
                         :dataCredit="author.dataCredit"
                         authorName="Dominik Haas-Artho"
                         @creditClick="catchCreditClick(author, $event)"
        />
      </v-col>
    </v-row>

    <v-row>
      readonly EditDataCredits
    </v-row>

    <v-row class="py-3" >
      <v-col style="background-color: gray;">
        <EditDataCredits :instruction="instruction"
                         :dataCredit="author.dataCredit"
                         authorName="Dominik Haas-Artho"
                         :dark="true"
                         :readOnly="true" />
      </v-col>
    </v-row>

  </v-col>
  `,
  methods: {
    catchCreditClick(author, creditName) {
      let dCredit = author.dataCredit;

      if (!dCredit){
        dCredit = [];
      }

      if (!dCredit.includes(creditName)) {
        dCredit.push(creditName);
      } else {
        const index = dCredit.indexOf(creditName);
        dCredit.splice(index, 1);
      }

      author.dataCredit = dCredit;
    },
  },
  data: () => ({
    emptyAuthor: {},
    author: extractedAuthors[0],
    instruction: AUTHORS_EDIT_CURRENT_DATACREDIT,
  }),
});

