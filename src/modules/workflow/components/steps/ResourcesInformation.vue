<template>
  <v-container fluid class="pa-0" id="ResourcesInformation">
    <v-row>
      <v-col cols="6">
        <v-row v-if="selectedResource">
          <v-col v-if="resourceEditingActive" >
            <!-- prettier-ignore -->
            <ResourceEditing v-bind="editResourceObject"
                          @closeClicked="catchEditResourceClose"
                          @saveResource="catchSaveResourceClose"
                          @previewImageClicked="showFullScreenImage"
            />
          </v-col>

          <v-col v-if="!resourceEditingActive" >
            <EditResourceRedirect title="Edit Selected Resource"
                                  :text="editResourceRedirectText"
                                  buttonText="Edit Resources"
                                  :buttonUrl="linkEditResourceCKAN"
            >
              <BaseRectangleButton
                  buttonText="Deselect Resource"
                  color="warning"
                  @clicked="catchEditResourceClose"
              />

            </EditResourceRedirect>

          </v-col>
        </v-row>

        <v-row v-if="!selectedResource">
          <!--
                    <v-col cols="12">
                      <EditMultiDropResourceFiles @createResources="createResourceFromFiles" />
                    </v-col>
          -->

          <v-col v-if="resourceUploadActive"
                 cols="12">
            <EditDropResourceFiles v-bind="editDropResourceObject" />
<!--
            No need to listen to events from the component, events are emitted from uppy directly
-->
          </v-col>

          <v-col v-if="resourceUploadActive"
                 cols="12">
            <EditResourcePasteUrl @createUrlResources="createResourceFromUrl"/>
          </v-col>

          <v-col v-if="!resourceUploadActive"
                 cols="12">
            <EditResourceRedirect title="Add New Resource"
                                  :text="addResourceRedirectText"
                                  buttonText="Add Resources"
                                  :buttonUrl="linkAddNewResourcesCKAN"
            />
          </v-col>

        </v-row>
      </v-col>

      <v-col cols="6">
        <ResourcesListEditing v-bind="metadataResourcesGenericProps"/>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
/**
 * ResourcesInformation.vue shows all the resources of a metadata entry in a list.
 *
 * @summary shows the resources for a metadata entry
 * @author Dominik Haas-Artho & Sam Woodcock
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mapGetters, mapState } from 'vuex';
import {defineAsyncComponent} from 'vue';
import {
  eventBus,
  CANCEL_EDITING_RESOURCE,
  OPEN_TEXT_PREVIEW,
  SAVE_EDITING_RESOURCE,
  UPLOAD_STATE_UPLOAD_COMPLETED,
  UPLOAD_STATE_UPLOAD_PROGRESS,
  UPLOAD_STATE_UPLOAD_STARTED,
  UPLOAD_STATE_RESET,
  EDITMETADATA_CLEAR_PREVIEW,
  UPLOAD_STATE_RESOURCE_CREATED,
} from '@/factories/eventBus.js';

import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts.js';

import {
  getUppyInstance,
  subscribeOnUppyEvent,
  unSubscribeOnUppyEvent,
  createNewResourceForUrl, destroyUppyInstance,
} from '@/factories/uploadFactory.js';

import {
  ACTION_GET_USER_LIST,
  FETCH_USER_DATA,
  GET_USER_LIST,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_CREATION_RESOURCE,
  METADATA_EDITING_SELECT_RESOURCE,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts.js';

import { getSelectedElement } from '@/factories/userEditingFactory.js';
import { mergeResourceSizeForFrontend } from '@/factories/mappingFactory.js';

import ResourcesListEditing from '@/modules/workflow/components/steps/ResourcesListEditing.vue';
import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles.vue';
import EditResourcePasteUrl from '@/modules/user/components/EditResourcePasteUrl.vue';

const ResourceEditing = defineAsyncComponent(() =>
    import('@/modules/workflow/components/steps/ResourceEditing.vue'),
);
const EditResourceRedirect = defineAsyncComponent(() =>
    import('@/modules/user/components/EditResourceRedirect.vue'),
);
const BaseRectangleButton = defineAsyncComponent(() =>
    import('@/components/BaseElements/BaseRectangleButton.vue'),
);

export default {
  name: 'ResourcesInformation',
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
/*
    metadataId: {
      type: String,
      default: '',
    },
*/
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
    userEditMetadataConfig: {
      type: Object,
      default: undefined,
    },
  },
  created() {
    // call once to create the uppy instance
    getUppyInstance(this.metadataId, this.$store);

    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.unselectCurrentResource);
    eventBus.on(UPLOAD_STATE_RESET, this.resetUppy);
    eventBus.on(UPLOAD_STATE_RESOURCE_CREATED, this.uploadResourceCreated);
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
    ...mapGetters(USER_SIGNIN_NAMESPACE, [
      'user',
      'userLoading',
    ]),
    ...mapState(USER_NAMESPACE, [
      'envidatUsers',
      'uploadError',
    ]),
    resourceUploadError() {
      if (this.$store) {
        return this.uploadError;
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
    metadataId() {
      return this.$route?.params?.metadataid || null;
    },
    metadataResourcesGenericProps() {
      return {
        resources: this.resources,
        dataLicenseTitle: this.dataLicenseTitle,
        dataLicenseUrl: this.dataLicenseUrl,
        resourcesConfig: {
          downloadActive: false,
        },
        readOnlyFields: this.readOnlyFields,
        readOnlyExplanation: this.readOnlyExplanation,
      };
    },
    editResourceObject() {
      let userEditMetadataConfig;

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

      return {
        ...this.selectedResource,
        ...mergedSize,
        userEditMetadataConfig,
        envidatUsers: this.allEnviDatUsers,
      };
    },
    editDropResourceObject() {
      return {
        metadataId: this.metadataId,
        legacyUrl: this.linkAddNewResourcesCKAN,
        state: this.uploadState,
        progress: this.uploadProgress,
        error: this.resourceUploadError?.message || this.uppyError?.name,
        errorDetails: this.resourceUploadError?.details || this.uppyError?.message,
      };
    },
    selectedResource() {
      return getSelectedElement(this.resources);
    },
    linkAddNewResourcesCKAN() {
      //      return `${this.envidatDomain}/dataset/resources/${this.metadataId}`;
      return `${this.envidatDomain}/dataset/resources/${this.metadataId}`;
    },
    linkEditResourceCKAN() {
      //      return `${this.envidatDomain}/dataset/${this.metadataId}/resource/${this.selectedResource.id}/edit`;
      return `${this.envidatDomain}/dataset/${this.metadataId}/resource/${this.selectedResource.id}`;
    },
  },
  methods: {
    loadEnvidatUsers() {
      if (this.$store && !this.envidatUsers && this.user) {
        this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`,
          {
            action: ACTION_GET_USER_LIST,
            body: {
              id: this.user.id,
              include_datasets: true,
            },
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
      const newRes = this.$store?.getters[`${USER_NAMESPACE}/uploadResource`];

      setTimeout(() => {
        console.log(METADATA_EDITING_SELECT_RESOURCE, newRes);
        this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, newRes?.id);

        // reset uppy to be able to upload another file
        this.resetUppy();
      }, 500);

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

      const uppy = getUppyInstance();

      const files = uppy.getFiles();
      if (files.length > 0) {
        uppy.cancelAll();
      } else {
        uppy.clear()
      }
    },
    async createResourceFromUrl(url) {
      // console.log(`createResourceFromUrl ${url}`);

      const metadataId = this.metadataId;

      const newResource = createNewResourceForUrl(metadataId, url);

      // create resource from url
      await this.$store?.dispatch(`${USER_NAMESPACE}/${METADATA_CREATION_RESOURCE}`, {
        data: newResource,
      });

      // resource exists already, get it from uploadResource
      const newRes = this.$store?.getters[`${USER_NAMESPACE}/uploadResource`];

      this.$nextTick(() => {
        this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, newRes?.id);
      });
    },
    unselectCurrentResource() {
      if(this.selectedResource) {
        this.$store.commit(`${USER_NAMESPACE}/${METADATA_CANCEL_RESOURCE_EDITING}`, this.selectedResource?.id);
      }
    },
    catchEditResourceClose() {
      eventBus.emit(CANCEL_EDITING_RESOURCE, this.selectedResource);
    },
    catchSaveResourceClose(resourceProps) {
      eventBus.emit(SAVE_EDITING_RESOURCE, resourceProps);
    },
    showFullScreenImage(url) {
      eventBus.emit(OPEN_TEXT_PREVIEW, url);
    },
  },
  data: () => ({
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
  }),
  components: {
    ResourcesListEditing,
    EditDropResourceFiles,
    // EditMultiDropResourceFiles,
    EditResourcePasteUrl,
    ResourceEditing,
    EditResourceRedirect,
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>
