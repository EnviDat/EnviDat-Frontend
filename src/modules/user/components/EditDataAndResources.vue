<template>
  <v-container fluid class="pa-0" id="EditDataAndResources">
    <v-row>
      <v-col cols="6">
        <v-row v-if="selectedResource">
          <v-col v-if="resourceEditingActive" >
            <!-- prettier-ignore -->
            <EditResource v-bind="editResourceObject"
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
        <EditMetadataResources v-bind="metadataResourcesGenericProps"/>
      </v-col>
    </v-row>

<!--
    <v-snackbar
        :value="!!uploadProgessText"
        bottom
        elevation="24"
    >
      <v-icon color="highlight">checkmark</v-icon>
      {{ uploadProgessText }}

    </v-snackbar>
-->

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

import { mapGetters, mapState } from 'vuex';
import {
  eventBus,
  CANCEL_EDITING_RESOURCE,
  OPEN_TEXT_PREVIEW,
  SAVE_EDITING_RESOURCE,
  UPLOAD_STATE_UPLOAD_COMPLETED,
  UPLOAD_STATE_UPLOAD_PROGRESS,
  UPLOAD_STATE_UPLOAD_STARTED,
  UPLOAD_STATE_RESET,
} from '@/factories/eventBus';

import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';

import EditMetadataResources from '@/modules/user/components/EditMetadataResources.vue';
import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles.vue';
import EditResourcePasteUrl from '@/modules/user/components/EditResourcePasteUrl.vue';
import EditResource from '@/modules/user/components/EditResource.vue';
import EditResourceRedirect from '@/modules/user/components/EditResourceRedirect.vue';

import {
  getUppyInstance,
  subscribeOnUppyEvent,
  unSubscribeOnUppyEvent,
  createNewResourceForUrl,
} from '@/factories/uploadFactory';

import {
  ACTION_GET_USER_LIST,
  FETCH_USER_DATA,
  GET_USER_LIST,
  METADATA_CREATION_RESOURCE,
  METADATA_EDITING_SELECT_RESOURCE,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import { getSelectedElement } from '@/factories/userEditingFactory';

import { mergeResourceSizeForFrontend } from '@/factories/mappingFactory';

const BaseRectangleButton = () => import('@/components/BaseElements/BaseRectangleButton.vue');

export default {
  name: 'EditDataAndResources',
  components: {
    EditMetadataResources,
    EditDropResourceFiles,
    // EditMultiDropResourceFiles,
    EditResourcePasteUrl,
    EditResource,
    EditResourceRedirect,
    BaseRectangleButton,
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
  mounted() {
    subscribeOnUppyEvent('upload', this.uploadStarted);
    subscribeOnUppyEvent('progress', this.uploadProgress);
    subscribeOnUppyEvent('complete', this.uploadCompleted);
    subscribeOnUppyEvent('cancel-all', this.cancelUpload);
    subscribeOnUppyEvent('error', this.uploadUppyError);

    this.$nextTick(() => {
      this.loadEnvidatUsers();
    });
  },
  beforeDestroy() {
    unSubscribeOnUppyEvent('upload', this.uploadStarted);
    unSubscribeOnUppyEvent('progress', this.uploadProgress);
    unSubscribeOnUppyEvent('complete', this.uploadCompleted);
    unSubscribeOnUppyEvent('cancel-all', this.cancelUpload);
    unSubscribeOnUppyEvent('error', this.uploadUppyError);
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
        console.log('mergeResourceSizeForFrontend failed:');
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
    uploadStarted() {
    // uploadStarted({ id, fileIDs }) {
      // data object consists of `id` with upload ID and `fileIDs` array
      // with file IDs in current upload
      // data: { id, fileIDs }
      // console.log(`Starting upload ${id} for files ${fileIDs}`);

      this.uppyError = null;
      this.uploadProgessText = 'Starting upload file';
      this.uploadProgressIcon = 'check_box_outline_blank';

      eventBus.emit(UPLOAD_STATE_UPLOAD_STARTED, { id: UPLOAD_STATE_UPLOAD_STARTED });
    },
    uploadProgress(progress) {
      // console.log(`upload progress: ${progress}`);
      this.uploadProgessText = `upload progress: ${progress}`;
      this.uploadProgressIcon = 'check';

      eventBus.emit(UPLOAD_STATE_UPLOAD_PROGRESS, { id: UPLOAD_STATE_UPLOAD_PROGRESS, progress });
    },
    async uploadCompleted(result) {
      const oks = result.successful?.length || 0;
      const fails = result.failed?.length || 0;

      // console.log('successful files:', result.successful)
      // console.log('failed files:', result.failed)

      let message = '';

      if (oks > 0) {
        message += `${oks} uploads successful`;
        this.uploadProgressIcon = 'check_circle';
      }

      if (fails > 0) {
        message += `${fails} failed uploads`;
        this.uploadProgressIcon = 'report_gmailerrorred';
      }

      eventBus.emit(UPLOAD_STATE_UPLOAD_COMPLETED, { id: UPLOAD_STATE_UPLOAD_COMPLETED });

      this.uploadProgessText = message;

      // reset uppy to be able to upload another file
      this.resetUppy();

      // resource exists already, get it from uploadResource
      const newRes = this.$store?.getters[`${USER_NAMESPACE}/uploadResource`];

      setTimeout(() => {
        this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, newRes?.id);
      }, 500);

    },
    uploadUppyError(error) {
      this.uppyError = error;

      this.uploadProgessText = `Upload failed ${error}`;
      this.uploadProgressIcon = 'report_gmailerrorred';

      eventBus.emit(UPLOAD_STATE_RESET);
    },
    cancelUpload() {
      this.resetUppy();
    },
    resetUppy() {
      eventBus.emit(UPLOAD_STATE_RESET);
      this.uppyError = null;

      const uppy = getUppyInstance();
      const files = uppy.getFiles();
      if (files.length === 1) {
        uppy.removeFile(files[0].id);
      } else if(files.length > 1) {
        uppy.cancelAll();
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
    envidatDomain: import.meta.env.VITE_ENVIDAT_PROXY,
    uploadProgessText: null,
    uploadProgressIcon: '',
    uppyError: null,
    editResourceRedirectText: `Editing metadata and uploading resources is not available right now.
                    <br />
                    Please edit resources via the legacy website by clicking on
                    the button below.`,
    addResourceRedirectText: `Adding new resources is not available.
                    <br />
                    Please add resources via the legacy website by clicking on
                    the button below.`,
  }),
};
</script>

<style scoped></style>
