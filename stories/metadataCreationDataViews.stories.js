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
import EditResource from '@/modules/user/components/EditResource.vue';

import {
  enhanceElementsWithStrategyEvents,
  localIdProperty,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

import {
  cleanListForFrontend,
  enhanceUserObject,
  mergeResourceSizeForFrontend,
} from '@/factories/mappingFactory';
import unFormatedMetadata from './js/metadata';
import userList from './testdata/user_list.json';

const envidatUsers = userList?.result || [];

for (let i = 0; i < envidatUsers.length; i++) {
  envidatUsers[i] = enhanceUserObject(envidatUsers[i]);
}

const allResources = [];

// console.log(`got metadata ${!!unFormatedMetadata}`);

for (let i = 0; i < unFormatedMetadata.length; i++) {
  const dataset = unFormatedMetadata[i];
  let resources = cleanListForFrontend(
    dataset.resources,
    EDITMETADATA_DATA_RESOURCE,
  );

  for (let j = 0; j < resources.length; j++) {
    const resource = resources[j];
    if (resource.restricted && typeof resource.restricted === 'string') {
      try {
        resource.restricted = JSON.parse(resource.restricted);
      } catch (e) {
        console.log(
          `resource failed ${resource.name} restricted ${resource.restricted}`,
        );
        console.error(e);
      }
    }
  }

  resources = enhanceElementsWithStrategyEvents(
    resources,
    SELECT_EDITING_RESOURCE_PROPERTY,
    true,
  );
  allResources.push(resources);
}

const deprecatedResources = [...allResources[1], ...allResources[2]];

deprecatedResources[1].deprecated = true;
deprecatedResources[2].deprecated = true;

export default {
  title: '9 Editing Metadata / Resource Views',
  decorators: [],
  parameters: {},
};

const userEditMetadataConfig = {
  editingRestrictingActive: true,
};

export const EditResourceViews = () => ({
  components: { EditResource },
  template: `
    <v-container>


      <h1>EditResource empty and with resource1</h1>

      <v-row class="py-3" >
        <v-col cols="12" lg="6" xl="4">
          <EditResource  />
        </v-col>

        <v-col cols="12" lg="6" xl="4">
          <EditResource v-bind="resource1" />
        </v-col>

      </v-row>


      <h1 class="mt-5">EditResource with resource2 & resource3</h1>

      <v-row class="py-3" >

        <v-col cols="12" lg="6" xl="4">
          <EditResource v-bind="resource2" />
        </v-col>

        <v-col cols="12" lg="6" xl="4">
          <EditResource v-bind="resource3" />
        </v-col>
      </v-row>


      <h1 class="mt-5">EditResource with resource4</h1>

      <v-row class="py-3" >

        <v-col cols="12" lg="6" xl="4">
          <EditResource v-bind="resource4" />
        </v-col>

      </v-row>

      <h1 class="mt-5">EditResource with warning for uppercase extension</h1>

      <v-row class="py-3" >

        <v-col cols="12" lg="6" xl="4">
          <EditResource v-bind="resource1" />
        </v-col>

      </v-row>

    </v-container>
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
        ...allResources[2][2],
        loading: true,
        envidatUsers,
      };
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
      ...allResources[0][0],
      ...mergeResourceSizeForFrontend(allResources[0][0]),
      userEditMetadataConfig,
      envidatUsers,
    },
    resource2: {
      ...allResources[0][1],
      ...mergeResourceSizeForFrontend(allResources[0][1]),
      userEditMetadataConfig,
      envidatUsers,
    },
    resource3: {
      ...allResources[2][0],
      ...mergeResourceSizeForFrontend(allResources[2][0]),
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

      <v-row>
        EditMetadataResources with deprecated resources
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditMetadataResources v-bind="deprecatedProps" />
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
      resources: allResources[2],
      selectionId: -1,
      resourcesConfig: {
        downloadActive: false,
      },
    },
    deprecatedProps: {
      id: '2',
      resources: deprecatedResources,
      selectionId: -1,
    },
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
        EditDataAndResources Component resourceUploadActive: true && resourceEditingActive: true
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
    genericProps() {
      return {
        resources: this.resources,
        license: unFormatedMetadata[0].license_title,
        licenseUrl: unFormatedMetadata[0].license_url,
        selectionId: this.selectionId,
        resourcesConfig: {
          downloadActive: false,
        },
      };
    },
    genericProps2() {
      return {
        resources: this.resources,
        license: unFormatedMetadata[0].license_title,
        licenseUrl: unFormatedMetadata[0].license_url,
        selectionId: this.selectionId,
        resourcesConfig: {
          downloadActive: false,
        },
        userEditMetadataConfig: {
          resourceUploadActive: true,
          resourceEditingActive: true,
          editingRestrictingActive: true,
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
      this.updateResource(newRes);
      this.cancelEditing();
    },
  },
  data: () => ({
    resources: allResources[0],
    selectionId: -1,
  }),
});
