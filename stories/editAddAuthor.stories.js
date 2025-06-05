/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import EditAddAuthor from '@/modules/user/components/EditAddAuthor.vue';

import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';

import { AuthorsViewModel } from '@/factories/ViewModels/AuthorsViewModel';

import unFormatedMetadataCards from './js/metadata';
import { EditDatasetServiceLayer } from '@/modules/workflow/viewModel/EditDatasetServiceLayer.js';
import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.js';


const metadataCards = [];


const serviceLayer = new EditDatasetServiceLayer(unFormatedMetadataCards[0])
const datasetVM = new DatasetViewModel(serviceLayer);
const authorsViewModel = new AuthorsViewModel(datasetVM.dataset);


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

const preSelectedAuthors2 = extractedAuthors.filter(value => value.fullName.includes('A'))[0];


export default {
  title: '3 Datasets / 2 Edit / Add New Author',
  component: EditAddAuthor,
};

export const Empty = {
  args: {
    existingAuthors: extractedAuthors,
  },
}

export const Loading = {
  args: {
    ...Empty.args,
    loading: true,
  },
}

export const Filled = {
  args: {
    ...preSelectedAuthors2,
    existingAuthors: extractedAuthors,
  },
}

export const FilledFromViewModel = {
  args: {
    ...authorsViewModel.authors[1],
    existingAuthors: extractedAuthors,
  },
}



/*
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
*/
