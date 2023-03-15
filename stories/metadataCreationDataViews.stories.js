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

import {
  CANCEL_EDITING_RESOURCE,
  EDITMETADATA_DATA_RESOURCE,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  SAVE_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE,

} from '@/factories/eventBus';

import EditMetadataResources from '@/modules/user/components/EditMetadataResources.vue';
import EditDataAndResources from '@/modules/user/components/EditDataAndResources.vue';
import EditDataInfo from '@/modules/user/components/EditDataInfo.vue';
import EditResource from '@/modules/user/components/EditResource.vue';

import {
  enhanceElementsWithStrategyEvents,
  localIdProperty, SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

import { cleanListForFrontend, mergeResourceSizeForFrontend } from '@/factories/mappingFactory';
import unFormatedMetadataCards from './js/metadata';
import userList from './testdata/user_list.json';

const envidatUsers = userList?.result || [];

const metadataCards = [];

// console.log(`got metadata ${!!unFormatedMetadataCards}`);

for (let i = 0; i < unFormatedMetadataCards.length; i++) {
  const dataset = unFormatedMetadataCards[i];
  let resources = cleanListForFrontend(dataset.resources, EDITMETADATA_DATA_RESOURCE);
  resources = enhanceElementsWithStrategyEvents(resources, SELECT_EDITING_RESOURCE_PROPERTY, true);
  metadataCards.push(resources);
}


export default {
  title: '9 Editing Metadata / Data Infos',
  decorators: [],
  parameters: {},
};

const userEditMetadataConfig = {
  editingRestrictingActive: true,
};

  export const EditResourceViews = () => ({
  components: { EditResource },
  template: `
    <v-col>

      <v-row>
        EditResource empty and with resource1
      </v-row>

      <v-row class="py-3" >
        <v-col cols="6">
          <EditResource  />
        </v-col>

        <v-col cols="6">
          <EditResource v-bind="resource1" />
        </v-col>

      </v-row>

      <v-row>
        EditResource with resource2 & resource 3
      </v-row>

      <v-row class="py-3" >

        <v-col cols="6">
          <EditResource v-bind="resource2" />
        </v-col>

        <v-col cols="6">
          <EditResource v-bind="resource3" />
        </v-col>
      </v-row>

      <v-row>
        EditResource with resource 4
      </v-row>

      <v-row class="py-3" >

        <v-col cols="6">
          <EditResource v-bind="resource4" />
        </v-col>

      </v-row>
    
    </v-col>
    `,
  created() {
    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  methods: {
    editComponentsChanged(updateObj) {
      this.resource1 = updateObj.data;
    },
  },
  computed: {
    resource4() {
      return {
        ...metadataCards[2][2],
        loading: true,
        envidatUsers,
      }
    },
  },
  data: () => ({
    emptyFirstGenericProps: {
      id: '1',
      resources: [],
      selectionId: -1,
      resourcesConfig: {
        downloadActive: false,
      },
    },
    resource1: {
      ... metadataCards[0][0],
      ...mergeResourceSizeForFrontend(metadataCards[0][0]),
      userEditMetadataConfig,
      envidatUsers,
    },
    resource2: {
      ...metadataCards[0][1],
      ...mergeResourceSizeForFrontend(metadataCards[0][1]),
      userEditMetadataConfig,
      envidatUsers,
    },
    resource3: {
      ...metadataCards[2][0],
      ...mergeResourceSizeForFrontend(metadataCards[2][0]),
      userEditMetadataConfig,
      envidatUsers,
    },
  }),
});

export const EditResourcesList = () => ({
    components: { EditMetadataResources },
    template: `
    <v-col>

      <v-row>
        EditMetadataResources EmptyList
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataResources v-bind="emptyFirstGenericProps" />
        </v-col>
      </v-row>

      <v-row>
        EditMetadataResources with resources
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataResources v-bind="genericProps" />
        </v-col>
      </v-row>
    </v-col>
    `,
    created() {
      eventBus.on(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    beforeDestroy() {
      eventBus.off(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    methods: {
      selectResource(id) {
        this.emptyFirstGenericProps = {
          ...this.emptyFirstGenericProps,
          selectionId: id,
        };
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
        resources: [],
        selectionId: -1,
        resourcesConfig: {
          downloadActive: false,
        },
      },
      genericProps: {
        id: '2',
        resources: metadataCards[2],
        selectionId: -1,
        resourcesConfig: {
          downloadActive: false,
        },
      },
    }),
  });

export const EditDataInfoViews = () => ({
  components: { EditDataInfo },
  template: `
    <v-col>

      <v-row>
        EditDataInfo Component Unfilled Dates
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataInfo :datesArray="datesArrayEmpty" />
        </v-col>
      </v-row>

      <v-row>
        EditDataInfo Component Prefilled Dates
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataInfo :datesArray="datesArrayFilled" />
        </v-col>
      </v-row>

    </v-col>
    `,
  computed: {
  },
  methods: {
  },
    data: () => ({
      datesArrayEmpty: [
        {
          dateType: '',
          date: '',
          dateEnd: '',
        },
      ],
      datesArrayFilled: [
        {
          dateType: 'collected',
          date: '01.08.2006',
          dateEnd: '6.09.2007',
        },
        {
          dateType: 'collected',
          date: '01.08.2006',
          dateEnd: '6.09.2007',
        },
        {
          dateType: 'collected',
          date: '01.08.2006',
          dateEnd: '6.09.2007',
        },
      ],
    }),
  });

export const EditDataAndResourcesListViews = () => ({
    components: { EditDataAndResources },
    template: `
    <v-col>

      <v-row>
        EditDataAndResources Component
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataAndResources v-bind="genericProps" />
        </v-col>
      </v-row>

      <v-row>
        EditDataAndResources Component resourceUploadActive: true
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditDataAndResources v-bind="genericProps2" />
        </v-col>
      </v-row>
    
    </v-col>
    `,
    created() {
      eventBus.on(SAVE_EDITING_RESOURCE, this.saveResource);
      eventBus.on(CANCEL_EDITING_RESOURCE, this.cancelEditing);
      eventBus.on(SELECT_EDITING_RESOURCE, this.selectResource);
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    beforeDestroy() {
      eventBus.off(SAVE_EDITING_RESOURCE, this.saveResource);
      eventBus.off(CANCEL_EDITING_RESOURCE, this.cancelEditing);
      eventBus.off(SELECT_EDITING_RESOURCE, this.selectResource);
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    },
    computed: {
      userEditMetadataConfig() {
        return {
          resourceUploadActive: true,
        };
      },
      genericProps() {
        return {
          resources: this.resources,
          selectionId: this.selectionId,
          resourcesConfig: {
            downloadActive: false,
          },
        };
      },
      genericProps2() {
        return {
          resources: this.resources,
          selectionId: this.selectionId,
          resourcesConfig: {
            downloadActive: false,
          },
          userEditMetadataConfig: this.userEditMetadataConfig,
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
          // if (r.id === newRes.id) {
          //   this.$set(res, i, newRes);
          //   return;
          // }

          if (r[localIdProperty]) {
            if (r[localIdProperty] === newRes.id) {
              this.$set(res, i, newRes);
              return;
            }
          } else if (r.id === newRes.id) {
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
          // if (r.id === id) {
          //   r.isSelected = selected;
          //   return;
          // }

          if (r[localIdProperty]) {
            if (r[localIdProperty] === id) {
              r.isSelected = selected;
              this.$set(res, i, r);
              return;
            }
          } else if (r.id === id) {
            r.isSelected = selected;
            this.$set(res, i, r);
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
      resources: metadataCards[0],
      selectionId: -1,
    }),
  });
