/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-04 11:14:59
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import {
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  eventBus,
} from '@/factories/eventBus';

import EditMetadataResources from '@/modules/user/components/EditMetadataResources';
import EditDataAndResources from '@/modules/user/components/EditDataAndResources';
import { createResources } from '@/factories/metaDataFactory';
import { enhanceResourcesStrategyEvents } from '@/factories/strategyFactory';
import unFormatedMetadataCards from './js/metadata';

const apiFactory = require('@/factories/apiFactory');

const metadataCards = [];

unFormatedMetadataCards.forEach((el) => {
  let formatted = apiFactory.solrResultToCKANJSON(el);
  // let keys = Object.keys(el.tags[0]);
  // let props = '';
  // keys.forEach(element => {
  //   props += element + ' ';
  // });
  // alert(typeof el.resources + ' resources: ' + el.resources.length + ' ' + el.resources instanceof Array);
  formatted = createResources(formatted);
  enhanceResourcesStrategyEvents(formatted.resources, SELECT_EDITING_RESOURCE_PROPERTY);
  metadataCards.push(formatted);
});


storiesOf('8 Metadata Creation Views / Data Info', module)
  .add('Edit Resources List', () => ({
    components: { EditMetadataResources },
    template: `
    <v-col>

      <v-row>
        EditMetadataResources EmptyList
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataResources :genericProps="emptyFirstGenericProps" />
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
          ...this.emptyFirstGenericProps,
          selectionId: id,
        };

        this.emptyFirstGenericProps = newGenerics;
      },
      // editComponentsChanged(updateObj) {
      //   if (updateObj.data.id === this.genericProps.id) {
      //     this.genericProps = updateObj.data;
      //   }
      //   if (updateObj.data.id === this.emptyFirstGenericProps.id) {
      //     this.emptyFirstGenericProps = updateObj.data;
      //   }
      // },
    },  
    data: () => ({
      emptyFirstGenericProps: {
        id: '1',
        resources: metadataCards[1].resources,
        selectionId: -1,
        resourcesConfig: {
          downloadActive: false,
        },
      },
      genericProps: {
        id: '2',
        resources: metadataCards[2].resources,
        selectionId: -1,
        resourcesConfig: {
          downloadActive: false,
        },
      },
    }),
  }))
  .add('Edit Data And Resources List', () => ({
    components: { EditDataAndResources },
    template: `
    <v-col>

      <v-row>
        EditDataAndResources Component
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataAndResources :genericProps="genericProps" />
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
      // editComponentsChanged(updateObj) {
      //   if (updateObj.data.id === this.genericProps.id) {
      //     this.genericProps = updateObj.data;
      //   }
      //   if (updateObj.data.id === this.emptyFirstGenericProps.id) {
      //     this.emptyFirstGenericProps = updateObj.data;
      //   }
      // },
    },  
    data: () => ({
      genericProps: {
        resources: metadataCards[0].resources,
        selectionId: -1,
        resourcesConfig: {
          downloadActive: false,
        },
      },
    }),
  }));
