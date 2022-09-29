/* eslint-disable import/no-extraneous-dependencies */
/*
import {
 withKnobs, text, number,
} from '@storybook/addon-knobs';
*/

import AuthorCard from '@/modules/metadata/components/AuthorCard';
import DataCreditLayout from '@/components/Layouts/DataCreditLayout';
import {
  createAuthors,
  extractAuthorsMap,
  getFullAuthorsFromDataset,
} from '@/factories/authorFactory';
import authorCollection from '../public/testdata/authorCollection.json';
import { CARD_VIEWS } from './storybookFolder';

import unFormatedMetadataCards from './js/metadata';

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  el.author = createAuthors(el);
  metadataCards.push(el);
});

const authorsMap = extractAuthorsMap(metadataCards);

const authorFromCollection = getFullAuthorsFromDataset(authorsMap, metadataCards[0])[0];
const authorFromCollection2 = getFullAuthorsFromDataset(authorsMap, metadataCards[1])[1];
const authorFromCollection3 = getFullAuthorsFromDataset(authorsMap, metadataCards[2])[2];
const authorFromCollection4 = getFullAuthorsFromDataset(authorsMap, metadataCards[2])[0];

// console.log(authorFromCollection.totalDataCredits);

const methods = {
  authors() {
    const items = Object.values(authorCollection);
    return items.splice(0, items.length / 2);
  },
};


export default {
  title: `${CARD_VIEWS}`,
  decorators: [],
  parameters: {},
};

export const AuthorCardViews = () => ({
  components: {
    AuthorCard,
    DataCreditLayout,
  },
/*
    props: {
      author: {
        default: {
          firstName: text('firstName', 'Felix'),
          lastName: text('lastName', 'Gugerli'),
          fullName: text('fullName', 'Felix Gugerli'),
          datasetCount: number('datasetCount', 7),
          affiliation: text('affiliation', 'WSL'),
          id: {
            identifier: text('identifier', '0000-0003-3878-1845'),
          },
          email: text('email', 'felix.gugerli@wsl.ch'),
          dataCredit: {
            collection: number('collection', 1),
            validation: number('validation', 2),
            curation: number('curation', 3),
            software: number('software', 4),
            publication: number('publication', 5),
            supervision: number('supervision', 6),
          },
        },
      },
    },
*/
  template: `
  <v-container grid-list-lg fluid pa-0>
    <v-row>

      <v-col cols="12" md="4" pt-5 >
        <author-card :author="emptyAuthor" />
      </v-col>
      
      <v-col cols="12" md="4" pt-5 >

        <author-card :author="authorFromCollection" />
      </v-col>      
      
      <v-col cols="12" md="4" pt-5 >
        <author-card :author="author" />
      </v-col>

      <v-col cols="12" md="4" pt-5 >
        <author-card :author="author" :overrideAuthorInfosExpanded="true"/>
      </v-col>
      
      <v-col cols="12" md="4" pt-5 >
        <author-card :author="authorFromCollection2" />
      </v-col>

      <v-col cols="12" md="4" pt-5 >
        <author-card :author="authorFromCollection2" :isSelected="true" />
      </v-col>
      
      <v-col cols="12" md="4" pt-5 >
        <author-card :author="authorFromCollection3" :loading="true" />
      </v-col>

      <v-col cols="12" md="4" pt-5 >
        <author-card :author="authorFromCollection4"
                     :loading="true"
                     :show-generic-open-button="true"
                     open-button-icon="edit"
                     open-button-tooltip="Editing Author"
        />
      </v-col>

      <v-col cols="12" md="4" pt-5 >
        <author-card :author="author2"
                     :show-generic-open-button="true"
                     open-button-icon="edit"
                     open-button-tooltip="Editing Author"
        />
      </v-col>      
    </v-row>
  </v-container>
  `,
  methods,
  computed: {
  },
  data: () => ({
    authorFromCollection,
    authorFromCollection2,
    authorFromCollection3,
    authorFromCollection4,
    datasetDataCredit: [
      'collection',
      'software',
    ],
    author: {
      firstName: 'Felix',
      lastName: 'Gugerli',
      fullName: 'Felix Gugerli',
      datasetCount: 7,
      affiliation: 'WSL',
      id: {
        identifier: '0000-0003-3878-1845',
      },
      email: 'felix.gugerli@wsl.ch',
      totalDataCredits: {
        collection: 10,
        validation: 3,
        curation: 12,
        software: 10,
        publication: 15,
        supervision: 1,
      },
    },
    author2: {
      firstName: 'Felix',
      lastName: 'Gugerli',
      fullName: 'Felix Gugerli',
      datasetCount: 77,
      affiliation: 'WSL',
      id: {
        identifier: '0000-0003-3878-1845',
      },
      email: 'felix.gugerli@wsl.ch',
      totalDataCredits: {
        collection: 20,
        validation: 20,
        curation: 32,
        software: 30,
        publication: 15,
        supervision: 20,
      },
    },
    emptyAuthor: {
      firstName: 'Some',
      lastName: 'Dude',
      fullName: 'Some Dude',
      datasetCount: 0,
      affiliation: 'WSL',
      id: {
        identifier: '01234-0003-3878-1845',
      },
      email: 'some.dude@wsl.ch',
      totalDataCredits: {
        collection: 0,
        validation: 0,
        curation: 0,
        software: 0,
        publication: 0,
        supervision: 0,
      },
    },
  }),
});

// stories.addDecorator(withKnobs);
