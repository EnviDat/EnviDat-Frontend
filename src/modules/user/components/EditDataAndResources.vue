<template>
  <v-container fluid class="pa-0" id="EditDataAndResources">
    <v-row>
      <v-col cols="6">
        <v-row v-if="selectedResource">
          <v-col>
            <!-- prettier-ignore -->
            <EditResource v-bind="selectedResource"
                          @closeClicked="catchEditResourceClose"
                          @saveResource="catchSaveResourceClose"
                          @triggerValidateField="validateField"
                          :validationErrors="validationErrors"/>

          </v-col>
        </v-row>

        <v-row v-if="!selectedResource">
          <!--
                    <v-col cols="12">
                      <EditMultiDropResourceFiles @createResources="createResourceFromFiles" />
                    </v-col>
          -->

          <v-col cols="12">
            <EditDropResourceFiles @createResources="createResourceFromFiles"/>
          </v-col>

          <v-col cols="12">
            <EditPasteResourceUrl @createResources="createResourceFromUrl"/>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="6">
        <EditMetadataResources v-bind="metadataResourcesGenericProps"/>
      </v-col>
    </v-row>

    <v-snackbar
        :value="!!uploadProgessText"
        bottom
        elevation="24"
    >
      <v-icon color="highlight">checkmark</v-icon>
      {{ uploadProgessText }}

    </v-snackbar>

  </v-container>
</template>

<script>
/**
 * EditDataAndResources.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources for a metadata entry
 * @author Dominik Haas-Artho & Sam Woodcock
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  CANCEL_EDITING_RESOURCE,
  EDITMETADATA_DATA_RESOURCES, EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  SAVE_EDITING_RESOURCE, SELECT_EDITING_RESOURCE,
  SELECT_EDITING_RESOURCE_PROPERTY,
} from '@/factories/eventBus';
import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';
import { enhanceElementsWithStrategyEvents } from '@/factories/strategyFactory';
// import { initializeLocalResource } from '@/factories/metaDataFactory';
// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';
import EditMetadataResources from '@/modules/user/components/EditMetadataResources.vue';
import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles.vue';
// import EditMultiDropResourceFiles from '@/modules/user/components/EditMultiDropResourceFiles.vue';
import EditPasteResourceUrl from '@/modules/user/components/EditPasteResourceUrl.vue';
import EditResource from '@/modules/user/components/EditResource.vue';
import { initializeLocalResource } from '@/factories/metaDataFactory';
import { subscribeOnUppyEvent, unSubscribeOnUppyEvent } from '@/factories/uploadFactory';

export default {
  name: 'EditDataAndResources',
  components: {
    EditMetadataResources,
    EditDropResourceFiles,
    // EditMultiDropResourceFiles,
    EditPasteResourceUrl,
    EditResource,
  },
  props: {
    resources: {
      type: Array,
      default: () => [],
    },
    metadataId: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    messageDetails: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: String,
      default: null,
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
  mounted() {
    subscribeOnUppyEvent('upload', this.uploadStarted);
    subscribeOnUppyEvent('progress', this.uploadProgress);
    subscribeOnUppyEvent('complete', this.uploadCompleted);
    subscribeOnUppyEvent('error', this.uploadError);

    // Add editing button to resource card
    if (Array.isArray(this.resources) && this.resources.length > 0) {
      enhanceElementsWithStrategyEvents(
          this.resources,
          SELECT_EDITING_RESOURCE_PROPERTY,
          true,
      );
    }
  },
  beforeDestroy() {
    unSubscribeOnUppyEvent('upload', this.uploadStarted);
    unSubscribeOnUppyEvent('progress', this.uploadProgress);
    unSubscribeOnUppyEvent('complete', this.uploadCompleted);
    unSubscribeOnUppyEvent('error', this.uploadError);
  },
  computed: {
    selectedName() {
      return this.selectedResource.name;
    },
    selectedDescription() {
      return this.selectedResource.name;
    },
    selectedUrl() {
      return this.selectedResource.name;
    },
    metadataResourcesGenericProps() {
      return {
        resources: this.resources,
        resourcesConfig: {
          downloadActive: false,
        },
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    selectedResource() {
      let selectedRes = null;
      const res = this.resources;

      if (res?.length > 0) {
        const selected = res.filter(r => r.isSelected);

        if (selected.length > 0) {
          selectedRes = selected[0];
        }
      }

      return selectedRes;
    },
    linkAddNewResourcesCKAN() {
      //      return `${this.envidatDomain}/dataset/resources/${this.metadataId}`;
      return `${this.envidatDomain}/dataset/resources/${this.metadataId}`;
    },
    linkEditResourceCKAN() {
      //      return `${this.envidatDomain}/dataset/${this.metadataId}/resource/${this.selectedResource.id}/edit`;
      return `${this.envidatDomain}/dataset/${this.metadataId}/resource/${this.selectedResource.id}`;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_RESOURCES);
    },
  },
  methods: {
    uploadStarted({ id, fileIDs }) {
      // data object consists of `id` with upload ID and `fileIDs` array
      // with file IDs in current upload
      // data: { id, fileIDs }
      console.log(`Starting upload ${id} for files ${fileIDs}`);
      this.uploadProgessText = `Starting upload file ${fileIDs}`;
      this.uploadProgressIcon = 'check_box_outline_blank';
    },
    uploadProgress(progress) {
      console.log(`upload progress: ${progress}`);
      this.uploadProgessText = `upload progress: ${progress}`;
      this.uploadProgressIcon = 'check';
    },
    uploadCompleted(result) {
      console.log('successful files:', result.successful)
      console.log('failed files:', result.failed)
      this.uploadProgessText = 'Upload successful';
      this.uploadProgressIcon = 'check_circle';
    },
    uploadError(error) {
      console.log('failed files:', error)
      this.uploadProgessText = `Upload failed ${error}`;
      this.uploadProgressIcon = 'report_gmailerrorred';
    },

    createResourceFromUrl(url) {
      // console.log(`createResourceFromUrl ${url}`);

      const metadataId = this.getMetadataId();

      this.initResource(metadataId, null, url);
    },
    createResourceFromFiles(files) {
      // console.log(`createResourceFromFiles ${files}`);
      const metadataId = this.getMetadataId();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        this.initResource(metadataId, file, null, i === files.length - 1);
      }
    },
    getMetadataId() {
      const metadataId =
          this.metadataId || `local_MetadataId_${this.localResCounter}`;
      this.localResCounter++;
      return metadataId;
    },
    initResource(metadataId, file, url, autoSelect = true) {
      const newRes = initializeLocalResource(metadataId, file, url);

      enhanceElementsWithStrategyEvents(
          [newRes],
          SELECT_EDITING_RESOURCE_PROPERTY,
          true,
      );

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: newRes,
      });

      if (autoSelect) {
        this.$nextTick(() => {
          eventBus.emit(SELECT_EDITING_RESOURCE, newRes.id);
        });
      }
    },
    catchEditResourceClose() {
      eventBus.emit(CANCEL_EDITING_RESOURCE, this.selectedResource);
    },
    catchSaveResourceClose() {
      eventBus.emit(SAVE_EDITING_RESOURCE, this.selectedResource);
    },
    validateField(field) {
      isFieldValid(
          field.property,
          field.value,
          this.validations,
          this.validationErrors,
      );
    },
  },
  data: () => ({
    EDIT_METADATA_RESOURCES_TITLE,
    localResCounter: 0,
    validationErrors: {
      name: null,
      description: null,
      url: null,
    },
    envidatDomain: import.meta.env.VITE_ENVIDAT_PROXY,
    uploadProgessText: null,
    uploadProgressIcon: '',
  }),
};
</script>

<style scoped></style>
