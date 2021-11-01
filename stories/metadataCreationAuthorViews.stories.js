/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-18 18:08:18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import {
  SELECT_EDITING_AUTHOR,
  eventBus,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_AUTHOR,
  CANCEL_EDITING_AUTHOR,
  SAVE_EDITING_AUTHOR,
} from '@/factories/eventBus';

import EditMetadataAuthors from '@/modules/user/components/EditMetadataAuthors';
import EditAuthorList from '@/modules/user/components/EditAuthorList';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker';

import {
  localIdProperty,
} from '@/factories/strategyFactory';
import {
  createAuthors,
  getFullAuthorsFromDataset,
  extractAuthorsMap,
} from '@/factories/authorFactory';

import unFormatedMetadataCards from './js/metadata';
import { METADATA_EDITING } from './storybookFolder';

const apiFactory = require('@/factories/apiFactory');

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  const formatted = apiFactory.solrResultToCKANJSON(el);
  formatted.authors = createAuthors(formatted);
  metadataCards.push(formatted);
});

const authorsMap = extractAuthorsMap(metadataCards);
const authorsObjs = getFullAuthorsFromDataset(authorsMap, metadataCards[1]);
// don't do it for now to disable Author Editing
// enhanceElementsWithStrategyEvents(authors, SELECT_EDITING_AUTHOR_PROPERTY);

// extract the names of the authors into a plain array of string for the baseUserPicker
const authors = [];
const authorsStrings = [];
authorsObjs.forEach((author) => {
  authors.push(author);
  authorsStrings.push(author.fullName);
});

const preSelectedAuthor = authorsStrings.filter(value => value.includes('Fischer'));
const preSelectedAuthors2 = authors.filter(value => value.fullName.includes('A'));
const preSelectedAuthors3 = authorsStrings.filter(value => value.includes('B'));

const storybookFolder = `${METADATA_EDITING} / Author Infos`;

storiesOf(storybookFolder, module)
  .add('User Picker', () => ({
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

    </v-col>
    `,
    methods: {
    },
    data: () => ({
      authors: authorsStrings,
      preSelectedAuthor,
      preSelectedAuthors3,
    }),
  }))
  .add('Edit Authors list', () => ({
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
      eventBus.$on(SELECT_EDITING_AUTHOR, this.selectAuthor);
    },
    beforeDestroy() {
      eventBus.$off(SELECT_EDITING_AUTHOR, this.selectAuthor);
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
        authors,
      },
      selectionId: -1,
    }),
  }))
  .add('Full editing of Authors', () => ({
    components: { EditAuthorList },
    template: `
      <v-col>

      <v-row>
        EditAuthorList
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditAuthorList v-bind="genericProps" />
        </v-col>
      </v-row>

      </v-col>
    `,
    created() {
      eventBus.$on(SAVE_EDITING_AUTHOR, this.saveAuthor);
      eventBus.$on(SELECT_EDITING_AUTHOR, this.selectAuthor);
      eventBus.$on(CANCEL_EDITING_AUTHOR, this.cancelEditing);
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.changeAuthors);
    },
    beforeDestroy() {
      eventBus.$on(SAVE_EDITING_AUTHOR, this.saveAuthor);
      eventBus.$off(SELECT_EDITING_AUTHOR, this.selectAuthor);
      eventBus.$on(CANCEL_EDITING_AUTHOR, this.cancelEditing);
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.changeAuthors);
    },
    computed: {
      genericProps() {
        return {
          selectionId: '',
          authors: this.preSelectedAuthors2,
          existingAuthors: this.authors,
        };
      },
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
          // if (r.email === id) {
          //   r.isSelected = selected;
          //   this.$set(auths, i, r);
          //   return;
          // }

          if (r[localIdProperty]) {
            if (r[localIdProperty] === id) {
              r.isSelected = selected;
              this.$set(auths, i, r);
              return;
            }
          } else if (r.email === id) {
            r.isSelected = selected;
            this.$set(auths, i, r);
            return;
          }
        }
      },
      saveAuthor(newAuthor) {
        newAuthor.existsOnlyLocal = false;
        this.updateResource(newAuthor);
        this.cancelEditing();
      },
      updateAuthors(newAuthor) {
        const auths = this.genericProps.authors;

        for (let i = 0; i < auths.length; i++) {
          const r = auths[i];
          if (r.localId) {
            if (r.localId === newAuthor.localId) {
              this.$set(auths, i, newAuthor);
              return;
            }
          } else if (r.email === newAuthor.email) {
            this.$set(auths, i, newAuthor);
            return;
          }
        }

        auths.unshift(newAuthor);
      },
      changeAuthors(updateObj) {
        if (updateObj.object === EDITMETADATA_AUTHOR) {

          this.updateAuthors(updateObj.data);
        }
      },
    },
    data: () => ({
      preSelectedAuthors2,
      authors,
    }),
  }));
