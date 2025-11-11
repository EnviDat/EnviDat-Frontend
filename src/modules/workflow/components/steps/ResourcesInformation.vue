<template>
  <v-container fluid class="pa-4" id="ResourcesInformation">
    <v-row class="mb-0">
      <v-col class="text-h5 font-weight-bold" cols="12"> Resources Information </v-col>
      <!-- <v-col cols="12" class="text-body-1">
        Please provide the resources of the dataset.
      </v-col> -->
    </v-row>

    <!-- Info Banner -->
    <v-row>
      <InfoBanner :show="showInfoBanner" :icon="mdiInformationOutline" @setInfoBanner="$emit('setInfoBanner', $event)">
        <p>
          This section allows you to provide access to the actual data or related resources of your dataset. These can
          be files, links to repositories, or online services.
        </p>

        <p><strong>Tips:</strong></p>
        <ol>
          <li>
            - You can either <strong>upload files directly</strong> or <strong>provide links</strong> to external
            resources (e.g., data hosted on other platforms).
          </li>
          <li>- Use clear and descriptive <strong>titles</strong> for each resource to improve discoverability.</li>
          <li>
            - filename/extension automatically get converted to lowercase. To preserve uppercase extensions (e.g., .R),
            please upload a compressed (.zip) version of your file.
          </li>
          <li>
            - When adding a resource via a link, make sure to specify its
            <strong>file format</strong> (e.g., CSV, GeoTIFF) and <strong>file size</strong> to help users assess it.
          </li>
          <li>
            - If your resources are DORA publications, please add them in the
            <em>Related Publications</em> step instead.
          </li>
          <li>
            - You can <strong>reorder resources</strong> using drag-and-drop to reflect importance or logical sequence.
          </li>
          <li>
            - <strong>Deleting of a resource</strong> is not possible once you published your dataset. You have to
            upload a new version and mark the old as deprecated, but it has to still be visible due the DOI
            restrictions.
          </li>
          <li>
            - <strong>Updating a resource</strong> when the dataset is published its the same as with deleting a
            resource. Mark it as deprecated and upload a new version. Make sure you adjust the description accordingly.
            If the dataset is not published yet, do the same and send an email to
            <a href="mailto:envidat@wsl.ch">envidat@wsl.ch</a> then we can remove the old one.
          </li>
        </ol>

        <p class="mt-2">
          Adding meaningful and well-described resources greatly enhances the usability and visibility of your dataset.
        </p>
      </InfoBanner>
    </v-row>

    <v-row>
      <v-col cols="12" lg="6">
        <v-row v-if="selectedResource">
          <v-col v-if="resourceEditingActive">
            <!-- prettier-ignore -->
            <ResourceEditing v-bind="resourceEditingProps"
                             @closeClicked="catchEditResourceClose"
                             @validate="validateResource"
                             @save="saveResource"
                             @previewImageClicked="showFullScreenImage"
                             @delete="() => $emit('delete', selectedResource)"
            />
          </v-col>
        </v-row>

        <v-row v-if="!selectedResource">
          <v-col cols="12">
            <ResourceUpload flat v-bind="resourceUploadProps" />
            <!-- No need to listen to events from the component, events are emitted from uppy directly -->
          </v-col>

          <v-col cols="12">
            <ResourcesPasteUrl flat @createUrlResources="createResourceFromUrl" />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" lg="6">
        <ResourcesListEditing v-bind="metadataResourcesGenericProps" @save="save" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/**
 * ResourcesInformation.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources for a metadata entry
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters, mapState } from 'vuex';

import {
  eventBus,
  OPEN_TEXT_PREVIEW,
  UPLOAD_STATE_UPLOAD_COMPLETED,
  UPLOAD_STATE_UPLOAD_PROGRESS,
  UPLOAD_STATE_UPLOAD_STARTED,
  UPLOAD_STATE_RESET,
  EDITMETADATA_CLEAR_PREVIEW,
  UPLOAD_STATE_RESOURCE_CREATED,
  SELECT_EDITING_RESOURCE,
} from '@/factories/eventBus.js';

import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts.js';

import {
  getUppyInstance,
  subscribeOnUppyEvent,
  unSubscribeOnUppyEvent,
  createNewResourceForUrl,
  destroyUppyInstance,
} from '@/modules/workflow/utils/workflowUpload';

import {
  ACTION_GET_USER_LIST,
  FETCH_USER_DATA,
  GET_USER_LIST,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts.js';

import { mdiInformationOutline } from '@mdi/js';

import { updateEditingArray } from '@/factories/userEditingFactory.js';

import ResourcesListEditing from '@/modules/workflow/components/steps/ResourcesListEditing.vue';
import ResourceUpload from '@/modules/workflow/components/steps/ResourceUpload.vue';
import ResourcesPasteUrl from '@/modules/workflow/components/steps/ResourcesPasteUrl.vue';
import { ResourceViewModel } from '@/modules/workflow/viewModel/ResourceViewModel';
import type { Resource } from '@/types/modelTypes';
import { mergeResourceSizeForFrontend } from '@/factories/resourceHelpers.ts';
import ResourceEditing from '@/modules/workflow/components/steps/ResourceEditing.vue';
import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow.ts';
import InfoBanner from '@/modules/workflow/components/steps/InformationBanner.vue';

export default {
  name: 'ResourcesInformation',
  props: {
    resources: { type: Array, default: () => [] },
    dataLicenseTitle: { type: String, default: undefined },
    dataLicenseUrl: { type: String, default: undefined },
    datasetId: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    message: { type: String, default: '' },
    messageDetails: { type: String, default: null },
    error: { type: String, default: '' },
    errorDetails: { type: String, default: null },
    validationErrors: { type: Object, default: () => ({}) },
    showInfoBanner: { type: Boolean, default: true },
    userEditMetadataConfig: { type: Object, default: undefined },
  },
  emits: ['save', 'reload', 'delete'],
  created() {
    // call once to create the uppy instance
    getUppyInstance(this.workflowStore);

    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.unselectCurrentResource);
    eventBus.on(UPLOAD_STATE_RESET, this.resetUppy);
    eventBus.on(UPLOAD_STATE_RESOURCE_CREATED, this.uploadResourceCreated);
    eventBus.on(SELECT_EDITING_RESOURCE, this.catchResourceSelection);
  },
  mounted() {
    subscribeOnUppyEvent('file-added', this.uploadResetState);
    subscribeOnUppyEvent('upload', this.uploadStarted);
    subscribeOnUppyEvent('progress', this.uploadStateProgress);

    subscribeOnUppyEvent('upload-success', this.uploadCompleted);
    subscribeOnUppyEvent('file-removed', this.cancelUpload);
    subscribeOnUppyEvent('error', this.uploadUppyError);

    this.$nextTick(() => {
      this.loadEnvidatUsers();
    });
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.unselectCurrentResource);
    eventBus.off(UPLOAD_STATE_RESET, this.resetUppy);
    eventBus.off(UPLOAD_STATE_RESOURCE_CREATED, this.uploadResourceCreated);
    eventBus.off(SELECT_EDITING_RESOURCE, this.catchResourceSelection);

    unSubscribeOnUppyEvent('file-added', this.uploadResetState);
    unSubscribeOnUppyEvent('upload', this.uploadStarted);
    unSubscribeOnUppyEvent('progress', this.uploadStateProgress);

    unSubscribeOnUppyEvent('upload-success', this.uploadCompleted);
    unSubscribeOnUppyEvent('file-removed', this.cancelUpload);
    unSubscribeOnUppyEvent('error', this.uploadUppyError);

    destroyUppyInstance();
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(USER_SIGNIN_NAMESPACE, ['user', 'userLoading']),
    ...mapState(USER_NAMESPACE, ['envidatUsers']),
    resourceUploadError() {
      if (this.workflowStore) {
        return this.workflowStore.uploadError;
      }

      return null;
    },
    allEnviDatUsers() {
      if (this.$store) {
        return this.envidatUsers;
      }

      return undefined;
    },
    resourceUploadActive() {
      if (this.$store) {
        return this.config?.userEditMetadataConfig?.resourceUploadActive || false;
      }

      return this.userEditMetadataConfig?.resourceUploadActive || false;
    },
    resourceEditingActive() {
      if (this.$store) {
        return this.config?.userEditMetadataConfig?.resourceEditingActive || false;
      }

      return this.userEditMetadataConfig?.resourceEditingActive || false;
    },
    metadataResourcesGenericProps() {
      return {
        resources: this.resources,
        validationErrors: this.validationErrors,
        dataLicenseTitle: this.dataLicenseTitle,
        dataLicenseUrl: this.dataLicenseUrl,
        resourcesConfig: { downloadActive: false },
      };
    },
    resourceEditingProps() {
      let userEditMetadataConfig: object;

      if (this.$store) {
        userEditMetadataConfig = this.config?.userEditMetadataConfig;
      } else {
        userEditMetadataConfig = this.userEditMetadataConfig;
      }

      let mergedSize = {};
      try {
        mergedSize = mergeResourceSizeForFrontend(this.selectedResource);
      } catch (e) {
        console.error('mergeResourceSizeForFrontend failed:');
        console.error(e);
        // TODO Error tracking
      }

      return { ...this.resourceViewModel, ...mergedSize, userEditMetadataConfig, envidatUsers: this.allEnviDatUsers };
    },
    resourceUploadProps() {
      return {
        metadataId: this.datasetId,
        legacyUrl: this.linkAddNewResourcesCKAN,
        state: this.uploadState,
        progress: this.uploadProgress,
        error: this.resourceUploadError?.message || this.uppyError?.name,
        errorDetails: this.resourceUploadError?.details || this.uppyError?.message,
      };
    },
    selectedResource() {
      return this.resourceViewModel;
      // return getSelectedElement(this.resources);
    },
    linkAddNewResourcesCKAN() {
      //      return `${this.envidatDomain}/dataset/resources/${this.datasetId}`;
      return `${this.envidatDomain}/dataset/resources/${this.datasetId}`;
    },
    linkEditResourceCKAN() {
      //      return `${this.envidatDomain}/dataset/${this.datasetId}/resource/${this.selectedResource.id}/edit`;
      return `${this.envidatDomain}/dataset/${this.datasetId}/resource/${this.selectedResource.id}`;
    },
  },
  methods: {
    loadEnvidatUsers() {
      if (this.$store && !this.envidatUsers && this.user) {
        this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`, {
          action: ACTION_GET_USER_LIST,
          body: { id: this.user.id, include_datasets: true },
          commit: true,
          mutation: GET_USER_LIST,
        });
      }
    },
    uploadResetState() {
      this.uploadState = undefined;
      this.uploadProgress = 0;
    },
    uploadStarted({ uploadID, files }) {
      // data object consists of `id` with upload ID and `fileIDs` array
      // with file IDs in current upload
      // data: { id, fileIDs }
      // console.log(`Starting upload ${uploadID } for files ${files}`);

      this.uppyError = null;
      this.uploadState = UPLOAD_STATE_UPLOAD_STARTED;
      this.uploadProgress = 0;
    },
    uploadResourceCreated(event) {
      // console.log(`Resource created ${event.resourceId}`);
      this.uploadState = UPLOAD_STATE_RESOURCE_CREATED;
    },
    uploadStateProgress(progress) {
      // console.log(`upload progress: ${progress}`);

      this.uploadState = UPLOAD_STATE_UPLOAD_PROGRESS;
      this.uploadProgress = progress;
    },
    async uploadCompleted() {
      // console.log('upload complete');

      this.uploadState = UPLOAD_STATE_UPLOAD_COMPLETED;
      this.uploadProgress = 0;

      // resource exists already, get it from uploadResource
      const newResId = this.workflowStore.uploadingResourceId;

      // trigger reload of datasets to get the new resource
      this.$emit('reload');

      setTimeout(() => {
        // console.log(METADATA_EDITING_SELECT_RESOURCE, newRes);

        // select the uploaded resource for editing
        this.selectResource(newResId);

        // reset uppy to be able to upload another file
        this.resetUppy();
      }, 1000);
    },
    uploadUppyError(error) {
      // console.log('uploadUppyError', error);

      this.uppyError = error;
    },
    cancelUpload() {
      this.resetUppy();
    },
    resetUppy() {
      // console.log('resetUppy');

      this.uppyError = null;
      this.uploadState = undefined;
      this.uploadProgress = 0;

      const uppy = getUppyInstance(this.workflowStore);

      const files = uppy.getFiles();
      if (files.length > 0) {
        uppy.cancelAll();
      } else {
        uppy.clear();
      }
    },
    async createResourceFromUrl(url: string) {
      // console.log(`createResourceFromUrl ${url}`);

      const datasetId = this.datasetId;
      const newResource = createNewResourceForUrl(datasetId, url);

      this.resourceViewModel = new ResourceViewModel();
      const validData = this.resourceViewModel.validate(newResource);

      if (!validData) {
        console.error('Invalid Data for new resources', newResource);
        return;
      }

      const currentResources = [...this.resources];
      const resourceModelData = this.resourceViewModel.getModelData<Resource>();
      currentResources.push(resourceModelData);

      this.$emit('save', { resources: currentResources });
      /*
      // resource exists already, get it from uploadResource
      const newRes = this.$store?.getters[`${USER_NAMESPACE}/uploadResource`];

      this.$nextTick(() => {
        this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, newRes?.id);
      });
*/
    },
    catchEditResourceClose() {
      this.unselectCurrentResource();
    },
    markResourceSelected(resources: Resource[], id: string, isSelected: boolean) {
      const resToMark = resources.filter((resource) => resource.id === id)[0];
      if (resToMark) {
        resToMark.isSelected = isSelected;
      }
    },
    validateResource(resource: Partial<Resource>) {
      this.resourceViewModel.validate(resource);
    },
    saveResource(resource: Resource) {
      const validData = this.resourceViewModel.validate(resource);

      if (validData) {
        const updatedResources = updateEditingArray(
          this.resources,
          // make sure keep the deprecated flag
          { ...this.resourceViewModel.backendJSON, deprecated: resource.deprecated },
          'id',
        );

        this.save({ resources: updatedResources });

        this.resetResourceViewModel();
      }
    },
    save(data: { resources: Resource[] }) {
      this.$emit('save', data);
    },
    selectResource(resourceId: string) {
      const resource = this.resources.filter((res: Resource) => res.id === resourceId)[0];

      if (!resource) {
        return;
      }

      // clear the internal state of the UI component in case there was an input
      // on the adding of a new author
      eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);
      /*
      this.unselectCurrentResource();

      this.markResourceSelected(
        this.resources,
        resource.id,
        !resource.isSelected,
      );
*/

      this.resourceViewModel = new ResourceViewModel();
      this.resourceViewModel.validate(resource);
    },
    unselectCurrentResource() {
      if (this.selectedResource) {
        // this.selectedResource.isSelected = false;
        this.resetResourceViewModel();
      }
    },
    catchResourceSelection(resourceId: string) {
      this.selectResource(resourceId);
    },
    showFullScreenImage(url: string) {
      eventBus.emit(OPEN_TEXT_PREVIEW, url);
    },
    resetResourceViewModel() {
      this.resourceViewModel = undefined;

      // clear the internal state of the UI component
      eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);
    },
  },
  data: () => ({
    mdiInformationOutline,
    EDIT_METADATA_RESOURCES_TITLE,
    localResCounter: 0,
    envidatDomain: import.meta.env.VITE_API_ROOT,
    uppyError: null,
    editResourceRedirectText: `Editing metadata and uploading resources is not available right now.
                    <br />
                    Please edit resources via the legacy website by clicking on
                    the button below.`,
    addResourceRedirectText: `Adding new resources is not available right now.
                    <br />
                    Please add resources via the legacy website by clicking on
                    the button below.`,
    uploadProgress: 0,
    uploadState: undefined,
    // resourceViewModel is only used for mapping
    resourceViewModel: undefined,
    workflowStore: useDatasetWorkflowStore(),
  }),
  components: { ResourcesListEditing, ResourceUpload, ResourcesPasteUrl, ResourceEditing, InfoBanner },
};
</script>

<style scoped></style>
