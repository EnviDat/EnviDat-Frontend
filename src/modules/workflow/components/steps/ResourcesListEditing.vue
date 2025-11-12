<template>
  <v-container id="ResourcesListEditing" fluid class="pa-4">
    <v-row class="mb-5">
      <v-col>
        <div class="font-weight-bold">{{ EDIT_METADATA_RESOURCES_TITLE }}</div>
        <div class="text-caption">
          {{ editingInstructions }}
        </div>
      </v-col>
    </v-row>

    <v-row v-show="validationErrors.resources">
      <v-col>
        <v-alert type="error">
          {{ validationErrors.resources }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row no-gutters>
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
        <Resources v-bind="metadataResourcesGenericProps" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * ResourcesListEditing.vue shows all the resources of a metadata entry in a list.
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
import { EDIT_METADATA_RESOURCES_TITLE, METADATA_RESOURCES_SEQUENCE_PROPERTY } from '@/factories/metadataConsts.js';

import Resources from '@/modules/workflow/components/steps/Resources.vue';
import ExpandableLayout from '@/components/Layouts/ExpandableLayout.vue';
import BaseDraggableList from '@/components/BaseElements/BaseDraggableList.vue';

import { getResourceName } from '@/factories/resourceHelpers';

import { EDITMETADATA_CLEAR_PREVIEW, eventBus } from '@/factories/eventBus.js';

export default {
  name: 'ResourcesListEditing',
  components: {
    Resources,
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
    validationErrors: {
      type: Object,
      default: () => ({}),
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
        emptyText: 'No resources has been added yet. Upload a file or provide a link to a resource.',
        emptyTextColor: 'grey',
      };
    },
  },
  methods: {
    reorderList(newList) {
      const newRes = [];

      for (let i = 0; i < newList.length; i++) {
        const resName = newList[i];

        const res = this.resourcesField.filter((r) => getResourceName(r) === resName)[0];

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

      this.$emit('save', {
        resources: this.previewResources,
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
