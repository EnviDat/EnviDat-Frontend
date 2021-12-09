/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
/*
import {
 withKnobs, text, number,
} from '@storybook/addon-knobs';
*/

import AuthorCard from '@/modules/metadata/components/AuthorCard';
import authorCollection from '../public/testdata/authorCollection.json';

const authorFromCollection = Object.values(authorCollection)[1];
const authorFromCollection2 = Object.values(authorCollection)[5];
const authorFromCollection3 = Object.values(authorCollection)[4];

export const methods = {
  authors() {
    const items = Object.values(authorCollection);
    return items.splice(0, items.length / 2);
  },
};


// const stories = storiesOf('3 Cards / Author Cards', module)
storiesOf('3 Cards / Author Cards', module)
  .add('Author Cards', () => ({
    components: { AuthorCard },
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
          <author-card :author="author" />
        </v-col>

        <v-col cols="12" md="4" pt-5 >
          <author-card :author="authorFromCollection" />
        </v-col>

        <v-col cols="12" md="4" pt-5 >
          <author-card :author="authorFromCollection2" :loading="true" />
        </v-col>

        <v-col cols="12" md="4" pt-5 >
          <author-card :author="authorFromCollection3" />
        </v-col>

      </v-row>
    </v-container>
    `,
    methods,
    data: () => ({
      authorFromCollection,
      authorFromCollection2,
      authorFromCollection3,
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
        dataCredit: {
          collection: 10,
          validation: 3,
          curation: 12,
          software: 10,
          publication: 15,
          supervision: 1,
        },
      },
    }),
  }));

// stories.addDecorator(withKnobs);
