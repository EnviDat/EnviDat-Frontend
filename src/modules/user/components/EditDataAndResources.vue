<template>
  <v-container fluid class="pa-0" id="EditDataAndResources">
    <v-row>
      <v-col cols="6">
        <v-row v-if="selectedResource">
          <v-col v-if="resourceUploadActive" >
            <!-- prettier-ignore -->
            <EditResource v-bind="selectedResource"
                          @closeClicked="catchEditResourceClose"
                          @saveResource="catchSaveResourceClose"
                          @previewImageClicked="showFullScreenImage"
            />
          </v-col>

          <v-col v-if="!resourceUploadActive" >
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
            <EditDropResourceFiles :metadataId="metadataId" />
<!--
            No need to listen to events from the component, events are emitted from uppy directly
-->
          </v-col>

          <v-col v-if="resourceUploadActive"
                 cols="12">
            <EditPasteResourceUrl @createUrlResources="createResourceFromUrl"/>
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
  EDITMETADATA_DATA_RESOURCES,
  eventBus,
  SAVE_EDITING_RESOURCE,
  UPLOAD_ERROR,
  UPLOAD_STATE_RESOURCE_UPDATED,
  UPLOAD_STATE_UPLOAD_COMPLETED,
  UPLOAD_STATE_UPLOAD_PROGRESS,
  UPLOAD_STATE_UPLOAD_STARTED,
} from '@/factories/eventBus';

import { EDIT_METADATA_RESOURCES_TITLE } from '@/factories/metadataConsts';

// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
} from '@/factories/userEditingValidations';
import EditMetadataResources from '@/modules/user/components/EditMetadataResources.vue';
import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles.vue';
// import EditMultiDropResourceFiles from '@/modules/user/components/EditMultiDropResourceFiles.vue';
import EditPasteResourceUrl from '@/modules/user/components/EditPasteResourceUrl.vue';
import EditResource from '@/modules/user/components/EditResource.vue';
import EditResourceRedirect from '@/modules/user/components/EditResourceRedirect.vue';

import {
  getUppyInstance,
  subscribeOnUppyEvent,
  unSubscribeOnUppyEvent,
} from '@/factories/uploadFactory';

import {
  METADATA_CREATION_RESOURCE,
  METADATA_EDITING_SELECT_RESOURCE,
  USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';
import { getSelectedElement } from '@/factories/userEditingFactory';

import { mapState } from 'vuex';

export default {
  name: 'EditDataAndResources',
  components: {
    EditMetadataResources,
    EditDropResourceFiles,
    // EditMultiDropResourceFiles,
    EditPasteResourceUrl,
    EditResource,
    EditResourceRedirect,
  },
  props: {
    resources: {
      type: Array,
      default: () => [],
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
    subscribeOnUppyEvent('error', this.uploadError);

  },
  beforeDestroy() {
    unSubscribeOnUppyEvent('upload', this.uploadStarted);
    unSubscribeOnUppyEvent('progress', this.uploadProgress);
    unSubscribeOnUppyEvent('complete', this.uploadCompleted);
    unSubscribeOnUppyEvent('error', this.uploadError);
  },
  computed: {
    ...mapState(['config']),
    resourceUploadActive() {
      if (this.$store) {
        return this.config?.userEditMetadataConfig?.resourceUploadActive || false;
      }

      return this.userEditMetadataConfig?.resourceUploadActive || false;
    },
    metadataId() {
      return this.$route?.params?.metadataid || null;
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
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_RESOURCES);
    },
  },
  methods: {
    uploadStarted({ id, fileIDs }) {
      // data object consists of `id` with upload ID and `fileIDs` array
      // with file IDs in current upload
      // data: { id, fileIDs }
/*
      console.log(`Starting upload ${id} for files ${fileIDs}`);
*/

      this.uploadProgessText = 'Starting upload file';
      this.uploadProgressIcon = 'check_box_outline_blank';

      eventBus.emit(UPLOAD_STATE_UPLOAD_STARTED, { id: UPLOAD_STATE_UPLOAD_STARTED });
    },
    uploadProgress(progress) {
      // console.log(`upload progress: ${progress}`);
/*
      this.uploadProgessText = `upload progress: ${progress}`;
      this.uploadProgressIcon = 'check';
*/

      eventBus.emit(UPLOAD_STATE_UPLOAD_PROGRESS, { id: UPLOAD_STATE_UPLOAD_PROGRESS, progress });
    },
    async uploadCompleted(result) {
      const oks = result.successful?.length || 0;
      const fails = result.failed?.length || 0;

/*
      console.log('successful files:', result.successful)
      console.log('failed files:', result.failed)
*/

      let message = '';
/*
      let uploadURL = null;
*/
      if (oks > 0) {
        message += `${oks} uploads successful`;
        this.uploadProgressIcon = 'check_circle';

/*
        uploadURL = result.successful[0]?.uploadURL || null;
*/
      }
      if (fails > 0) {
        message += `${fails} failed uploads`;
        this.uploadProgressIcon = 'report_gmailerrorred';
      }

      eventBus.emit(UPLOAD_STATE_UPLOAD_COMPLETED, { id: UPLOAD_STATE_UPLOAD_COMPLETED });

      this.uploadProgessText = message;


/*
      if (uploadURL) {
        await updateResourceWithFileUrl(uploadURL, this.$store);
        const resources = this.$store?.getters[`${USER_NAMESPACE}/resources`];

        console.log('after updateResourceWithFileUrl')
        console.log(resources)
      }
*/

      // reset uppy to be able to upload another file
      this.resetUppy()

      // resource exists already, get it from uploadResource
      const newRes = this.$store?.getters[`${USER_NAMESPACE}/uploadResource`];

      this.$nextTick(() => {
        this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, newRes.id);
      });

    },
    uploadError(error) {
/*
      console.log('failed files:', error)
*/

      this.uploadProgessText = `Upload failed ${error}`;
      this.uploadProgressIcon = 'report_gmailerrorred';

      const uppy = getUppyInstance();
      uppy.cancelAll({ reason: error});

      eventBus.emit(UPLOAD_ERROR, { error });
    },
    resetUppy() {
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

      // create resource from url
      await this.$store?.dispatch(`${USER_NAMESPACE}/${METADATA_CREATION_RESOURCE}`, {
        metadataId,
        // file: url,
        fileUrl: url,
        autoSelect: true,
      });

      // resource exists already, get it from uploadResource
      const newRes = this.$store?.getters[`${USER_NAMESPACE}/uploadResource`];

      if (newRes) {
        this.renameResource(newRes);
      }
    },
    renameResource(newRes) {
      // create a local copy because it might come directly from the $store
      const resource = {... newRes};

      // get new resource and adjust the name
      let resName = resource.url;
      const splits = resource.url.split('/');
      if (splits.length > 0) {
        resName = splits[splits.length - 1];

        const extSplits = resName.split('.');
        if (extSplits.length === 1) {
          resName = extSplits[0];
        } else if (extSplits.length > 1) {
          resName = extSplits[extSplits.length - 1];
        }
      }

      // changed the name to the last part of the url, because urls can be very long
      resource.name = resName;

      eventBus.emit(SAVE_EDITING_RESOURCE, resource);

      eventBus.emit(UPLOAD_STATE_RESOURCE_UPDATED, { id: UPLOAD_STATE_RESOURCE_UPDATED });
    },
    selectResourceAndUpdateList(resource) {

      // preselect it so the user can directly edit details
      // eventBus.emit(SELECT_EDITING_RESOURCE, resource.id);
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, resource.id);

      eventBus.emit(SAVE_EDITING_RESOURCE, resource);

      // is this.selectedResource set?

/*
      const resources = this.$store.getters[`${USER_NAMESPACE}/resources`];

      // is the needed? shouldn't be right!?

      // populate the new list of resources
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_RESOURCES,
        data: resources,
      });
*/

    },
    catchEditResourceClose() {
      eventBus.emit(CANCEL_EDITING_RESOURCE, this.selectedResource);
    },
    catchSaveResourceClose(resourceProps) {
      eventBus.emit(SAVE_EDITING_RESOURCE, resourceProps);
    },
    showFullScreenImage() {

    },
  },
  data: () => ({
    EDIT_METADATA_RESOURCES_TITLE,
    localResCounter: 0,
    envidatDomain: import.meta.env.VITE_ENVIDAT_PROXY,
    uploadProgessText: null,
    uploadProgressIcon: '',
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
