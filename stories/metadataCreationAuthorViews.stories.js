/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  SELECT_EDITING_AUTHOR,
} from '@/factories/eventBus';

import EditMetadataAuthors from '@/modules/user/components/EditMetadataAuthors.vue';
import EditAddAuthor from '@/modules/user/components/EditAddAuthor.vue';
import EditDataCredits from '@/modules/user/components/edit/EditDataCredits.vue';

import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';

import {
  createAuthors,
  extractAuthorsMapFromDatasets,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

import { AUTHORS_EDIT_CURRENT_DATACREDIT } from '@/factories/metadataConsts';
import unFormatedMetadataCards from './js/metadata';

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  el.author = createAuthors(el);
  metadataCards.push(el);
});

const { authorsMap } = extractAuthorsMapFromDatasets(metadataCards);
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
const preSelectedAuthors3 = authorsStrings.filter(value => value.includes('B'));


export default {
  title: '9 Editing Metadata / Author Infos',
  decorators: [],
  parameters: {},
};


export const EditAddAuthorViews = () => ({
  components: { EditAddAuthor },
  template: `
  <v-col>

    <v-row>
      EditAddAuthor with existing authors
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <EditAddAuthor v-bind="author"
                        :existingAuthors="authors"
                        :loading="loading" />
      </v-col>
    </v-row>

    <v-row>
      EditAddAuthor with the author
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <EditAddAuthor v-bind="author"  />
      </v-col>
    </v-row>

  </v-col>
  `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.changeAuthor);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.changeAuthor);
  },
  methods: {
    changeAuthor(updateObj) {
      if (updateObj.object === EDITMETADATA_AUTHOR) {
        this.loading = true;

        setTimeout(() => {
          this.author = updateObj.data;
          this.loading = false;
        }, 2000);
      }
    },
  },
  data: () => ({
    author: null,
    // authors: authorsStrings,
    authors: extractedAuthors,
    preSelectedAuthor,
    preSelectedAuthors3,
    loading: false,
  }),
});

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

export const EditingDataCreditViews = () => ({
  components: { EditDataCredits },
  template: `
  <v-col>

    <v-row>
      empty EditDataCredits with defaults
    </v-row>

    <v-row class="py-3" >
      <v-col style="background-color: darkgrey;">
        <EditDataCredits @creditClick="catchCreditClick(emptyAuthor, ...arguments)"
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
                          @creditClick="catchCreditClick(author, ...arguments)"
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
                         @creditClick="catchCreditClick(author, ...arguments)"
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

export const EditAuthorsListViews = () => ({
  components: { EditMetadataAuthors },
  template: `
  <v-col>

    <v-row>
      EditMetadataAuthors
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <EditMetadataAuthors v-bind="genericProps" />
      </v-col>
    </v-row>

  </v-col>
  `,
  created() {
    eventBus.on(SELECT_EDITING_AUTHOR, this.selectAuthor);
  },
  beforeDestroy() {
    eventBus.off(SELECT_EDITING_AUTHOR, this.selectAuthor);
  },
  methods: {
    selectAuthor(id) {
      if (this.selectionId !== '') {
        this.cancelEditing();
      }

      this.selectionId = id;
      this.setSelected(this.selectionId, true);
    },
    cancelEditing() {
      this.setSelected(this.selectionId, false);
      this.selectionId = '';
    },
    setSelected(id, selected) {
      const auths = this.genericProps.authors;

      for (let i = 0; i < auths.length; i++) {
        const r = auths[i];
        if (r.email === id) {
          r.isSelected = selected;
          return;
        }
      }
    },
  },
  data: () => ({
    genericProps: {
      id: '1',
      authorDetailsConfig: {
        showAuthorInfo: true,
      },
      selectionId: '',
      authors: extractedAuthors,
    },
    selectionId: -1,
  }),
});
