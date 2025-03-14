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
  CANCEL_EDITING_AUTHOR,
  EDITMETADATA_AUTHOR, EDITMETADATA_AUTHOR_DATACREDIT,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus, REMOVE_EDITING_AUTHOR,
  SAVE_EDITING_AUTHOR,
  SELECT_EDITING_AUTHOR,
} from '@/factories/eventBus';

import EditMetadataAuthors from '@/modules/user/components/EditMetadataAuthors.vue';
import EditAuthorList from '@/modules/user/components/edit/EditAuthorList.vue';
import EditAddAuthor from '@/modules/user/components/EditAddAuthor.vue';
import EditDataCredits from '@/modules/user/components/edit/EditDataCredits.vue';

import {
  combineAuthorLists,
  createAuthors,
  extractAuthorsMap,
  getAuthorName,
  getFullAuthorsFromDataset,
  mergeAuthorsDataCredit,
  mergeEditingAuthor,
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

const preSelectedAuthor = authorsStrings.filter(value => value.includes('Fischer'));
const preSelectedAuthors2 = extractedAuthors.filter(value => value.fullName.includes('A'));
const preSelectedAuthors3 = authorsStrings.filter(value => value.includes('B'));


export default {
  title: '3 Datasets / 2 Edit / Author Infos',
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
  beforeUnmount() {
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
  beforeUnmount() {
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

export const FullEditingAuthorViews = () => ({
  components: { EditAuthorList },
  template: `
    <v-col>

    <v-row>
      EditAuthorList
    </v-row>

    <v-row class="py-3" >
      <v-col >
        <EditAuthorList :authors="authors"
                        :existingAuthors="existingAuthors"
                        :authorsMap="authorsMap" />
      </v-col>
    </v-row>

    </v-col>
  `,
  created() {
    eventBus.on(SAVE_EDITING_AUTHOR, this.saveAuthor);
    eventBus.on(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.on(CANCEL_EDITING_AUTHOR, this.cancelEditing);
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.changeAuthors);
  },
  beforeUnmount() {
    eventBus.off(SAVE_EDITING_AUTHOR, this.saveAuthor);
    eventBus.off(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.off(CANCEL_EDITING_AUTHOR, this.cancelEditing);
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.changeAuthors);
  },
  methods: {
    removeAuthor(email) {
      const matches = this.authors.filter(auth => auth.email === email);
      console.log('remove Author');
      console.log(matches.length > 0);

      if (matches.length > 0) {
        const removeIndex = this.authors.indexOf(matches[0]);
        this.authors.splice(removeIndex, 1);
        console.log('remove index');
        console.log(removeIndex);
      }
    },
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
      eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);
    },
    setSelected(id, selected) {
      const auths = this.authors;
      for (let i = 0; i < auths.length; i++) {
        const author = auths[i];
        if (author.email === id) {
          author.isSelected = selected;
          return;
        }
      }

    },
    saveAuthor(newAuthor) {
      this.updateAuthors(newAuthor);
      this.cancelEditing();
    },
    updateAuthors(newAuthor) {
      const auths = this.genericProps.authors;

      for (let i = 0; i < auths.length; i++) {
        const r = auths[i];
        if (r.localId) {
          if (r.localId === newAuthor.localId) {
            auths[i] = newAuthor;
            return;
          }
        } else if (r.email === newAuthor.email) {
          auths[i] = newAuthor;
          return;
        }
      }

      auths.unshift(newAuthor);
    },
    changeAuthors(updateObj) {
      this.loading = true;

      if (updateObj.object === EDITMETADATA_AUTHOR_DATACREDIT) {
        const authorToMergeDataCredit = updateObj.data;

        // overwrite the authors and stepKey so it will be saved as if it was a EDITMETADATA_AUTHOR_LIST change (to the list of authors)
        this.authors = mergeAuthorsDataCredit(this.authors, authorToMergeDataCredit);
      }

      if (updateObj.object === EDITMETADATA_AUTHOR_LIST) {
        this.authors = combineAuthorLists(this.authors, updateObj.data.authors, updateObj.data.removedAuthors);
      }

      if (updateObj.object === EDITMETADATA_AUTHOR) {
        const updatedAuthor = updateObj.data;

        let changed = false;

        for (let i = 0; i < this.authors.length; i++) {
          const auth = this.authors[i];
          const email = auth.email;
          const fullName = auth.fullName;
          const searchAuthorFullName = getAuthorName({
            firstName: updatedAuthor.firstName,
            lastName: updatedAuthor.lastName,
          });

          if (email === updatedAuthor.email
            || fullName === searchAuthorFullName){

            const mergedAuthor = mergeEditingAuthor(updatedAuthor, auth);

            // this.authors[i] = createAuthor(updatedAuthor);

            this.authors[i] = mergedAuthor;
            // use $set to make the author entry reactive
            // this.$set(this.authors, i, author);

            changed = true;
            console.log(`Updated author ${ email } ${ fullName }`);
            break;
          }
        }

        if (!changed) {
          this.authors.push(updatedAuthor);

          this.selectAuthor(updatedAuthor.email);
          // this.$set(this.authors, this.authors.length - 1, updatedAuthor);
        }
      }

      if (updateObj.object === REMOVE_EDITING_AUTHOR) {
        this.removeAuthor(updateObj.data);
      }

      console.log('FullEditingAuthorView updated authors');
      console.log(this.authors);

      setTimeout(() => {
        this.loading = false;
        eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);
      }, 1000)
    },
  },
  data: () => ({
    loading: false,
    selectionId: '',
    authors: preSelectedAuthors2,
    existingAuthors: extractedAuthors,
    authorsMap,
  }),
});
