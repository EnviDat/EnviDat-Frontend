/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Rebecca Kurup Buchholz
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-11 16:50:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import {
  SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
  CANCEL_EDITING_RESOURCE,
  SAVE_EDITING_RESOURCE,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_RESOURCES,
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
      eventBus.$on(SAVE_EDITING_RESOURCE, this.saveResource);
      eventBus.$on(CANCEL_EDITING_RESOURCE, this.cancelEditing);
      eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.$off(SAVE_EDITING_RESOURCE, this.saveResource);
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
      eventBus.$off(CANCEL_EDITING_RESOURCE, this.cancelEditing);
      eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    computed: {
      genericProps() {
        return {
          resources: this.resources,
          selectionId: this.selectionId,
          resourcesConfig: {
            downloadActive: false,
          },  
        };
      },
    },
    methods: {
      selectResource(id) {
        if (this.selectionId !== -1) {
          this.cancelEditing();
        }
        
        this.selectionId = id;
        this.setSelected(this.selectionId, true);
      },
      cancelEditing() {
        this.setSelected(this.selectionId, false);
        this.selectionId = -1;
      },
      editComponentsChanged(updateObj) {
        if (updateObj.object === EDITMETADATA_DATA_RESOURCES) {

          this.updateResource(updateObj.data);
        }
      },
      updateResource(newRes) {
        const res = this.resources;

        for (let i = 0; i < res.length; i++) {
          const r = res[i];
          if (r.id === newRes.id) {
            this.$set(res, i, newRes);
            return;
          }
        }

        res.unshift(newRes);
      },
      setSelected(id, selected) {
        const res = this.resources;

        for (let i = 0; i < res.length; i++) {
          const r = res[i];
          if (r.id === id) {
            r.isSelected = selected;
            return;
          }
        }
      },
      saveResource(newRes) {
        newRes.existsOnlyLocal = false;
        this.updateResource(newRes);
        this.cancelEditing();
      },
    },
    data: () => ({
      resources: metadataCards[0].resources,
      selectionId: -1,
    }),
  }));
