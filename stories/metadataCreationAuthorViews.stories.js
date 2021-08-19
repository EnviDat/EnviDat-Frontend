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
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  // CANCEL_EDITING_RESOURCE,
  // SAVE_EDITING_RESOURCE,
  // EDITMETADATA_OBJECT_UPDATE,
  // EDITMETADATA_DATA_RESOURCES,
  eventBus,
} from '@/factories/eventBus';

import EditMetadataAuthors from '@/modules/user/components/EditMetadataAuthors';
// import EditDataAndResources from '@/modules/user/components/EditDataAndResources';
import { enhanceResourcesStrategyEvents } from '@/factories/strategyFactory';
import {
  createAuthors,
  getFullAuthorsFromDataset,
  extractAuthorsMap,
} from '@/factories/authorFactory';
import unFormatedMetadataCards from './js/metadata';

const apiFactory = require('@/factories/apiFactory');

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  const formatted = apiFactory.solrResultToCKANJSON(el);
  formatted.authors = createAuthors(formatted);
  enhanceResourcesStrategyEvents(formatted.authors, SELECT_EDITING_RESOURCE_PROPERTY);
  metadataCards.push(formatted);
});

const authorsMap = extractAuthorsMap(metadataCards);
const authors = getFullAuthorsFromDataset(authorsMap, metadataCards[1]);


storiesOf('8 Metadata Creation Views / Main Info', module)
  .add('Edit List of Authors', () => ({
    components: { EditMetadataAuthors },
    template: `
    <v-col>

      <v-row>
        EditMetadataAuthors
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataAuthors :genericProps="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    beforeDestroy() {
      eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    methods: {
      selectResource(id) {
        const newGenerics = {
          ...this.genericProps,
          selectionId: id,
        };

        this.genericProps = newGenerics;
      },
    },  
    data: () => ({
      genericProps: {
        id: '1',
        authors,
      },
    }),
  }));
