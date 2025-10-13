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
  EDITMETADATA_DATA_RESOURCE,
} from '@/factories/eventBus';

import EditDataAndResources from '@/modules/user/components/EditDataAndResources.vue';

import {
  enhanceElementsWithStrategyEvents,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/strategyFactory';

import {
  cleanListForFrontend,
  enhanceUserObject,
} from '@/factories/mappingFactory';

import unFormatedMetadata from '@/../stories/js/metadata';
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
  title: '3 Datasets / 2 Edit / Data And Resources',
  component: EditDataAndResources,
};


export const Empty = {}

export const WithResourcesDisabledNew = {
  args: {
    resources: allResources[0],
    license: unFormatedMetadata[0].license_title,
    licenseUrl: unFormatedMetadata[0].license_url,
    // selectionId: this.selectionId,
    resourcesConfig: {
      downloadActive: false,
    },
  },
}

export const WithResourcesEnabled = {
  args: {
    resources: allResources[0],
    license: unFormatedMetadata[0].license_title,
    licenseUrl: unFormatedMetadata[0].license_url,
    // selectionId: this.selectionId,
    resourcesConfig: {
      downloadActive: false,
    },
    userEditMetadataConfig: {
      resourceUploadActive: true,
      resourceEditingActive: true,
      editingRestrictingActive: true,
    },
  },
}

/*
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
  beforeUnmount() {
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
*/
