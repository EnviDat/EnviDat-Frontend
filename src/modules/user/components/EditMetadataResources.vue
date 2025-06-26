<template>
  <v-card id="EditMetadataResources" class="pa-4">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col class="text-h5">
          {{ EDIT_METADATA_RESOURCES_TITLE }}
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-1">
          {{ editingInstructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <ExpandableLayout
            statusText="Click here, drag and drop the resources to change the sequence."
            :startExpanded="resourcesNames?.length < 10"
            highlighted
            isFlat
          >
            <BaseDraggableList
              :items="resourcesNames"
              :draggableProperty="METADATA_RESOURCES_SEQUENCE_PROPERTY"
              :readOnlyFields="readOnlyFields"
              :readOnlyExplanation="readOnlyExplanation"
              @listChanged="reorderList"
            />
          </ExpandableLayout>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <MetadataResources v-bind="metadataResourcesGenericProps" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditMetadataResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources the a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-18 17:07:21
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  EDIT_METADATA_RESOURCES_TITLE,
  METADATA_RESOURCES_SEQUENCE_PROPERTY,
} from '@/factories/metadataConsts';

import MetadataResources from '@/modules/metadata/components/Metadata/MetadataResources.vue';
import ExpandableLayout from '@/components/Layouts/ExpandableLayout.vue';
import BaseDraggableList from '@/components/BaseElements/BaseDraggableList.vue';

import { getResourceName } from '@/factories/metaDataFactory';

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

export default {
  name: 'EditMetadataResources',
  components: {
    MetadataResources,
    ExpandableLayout,
    BaseDraggableList,
  },
  props: {
    resources: {
      type: Array,
      default: () => [],
    },
    dataLicenseTitle: {
      type: String,
      default: undefined,
    },
    dataLicenseUrl: {
      type: String,
      default: undefined,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    resourcesField() {
      // isFieldValid('resources', resources, this.validations, this.validationErrors)

      return this.previewResources || this.resources;
    },
    resourcesNames() {
      if (!this.resources) {
        return [];
      }

      return this.resources.map((r) => getResourceName(r));
    },
    metadataResourcesGenericProps() {
      return {
        resources: this.resourcesField,
        dataLicenseTitle: this.dataLicenseTitle,
        dataLicenseUrl: this.dataLicenseUrl,
        emptyText:
          'No resources has been added yet. Upload a file or provide a link to a resource.',
        emptyTextColor: 'grey',
        genericOpenButtonBottom: false,
      };
    },
  },
  methods: {
    reorderList(newList) {
      const newRes = [];

      for (let i = 0; i < newList.length; i++) {
        const resName = newList[i];

        const res = this.resourcesField.filter(
          (r) => getResourceName(r) === resName,
        )[0];

        if (res) {
          res.position = i;
          newRes.push(res);
        }
      }

      this.previewResources = newRes;
      this.notifyChange();
    },
    notifyChange() {
      if (!this.previewResources) {
        return;
      }

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: {
          ...this.$props,
          resources: this.previewResources,
        },
      });
    },
    clearPreviews() {
      this.previewResources = null;
    },
  },
  data: () => ({
    editingInstructions: 'Pick a resource from the list to edit its details',
    EDIT_METADATA_RESOURCES_TITLE,
    METADATA_RESOURCES_SEQUENCE_PROPERTY,
    previewResources: null,
  }),
};
</script>

<style scoped></style>
