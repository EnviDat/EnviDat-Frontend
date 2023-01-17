<template>
  <v-card id="EditDropResourceFiles" class="pa-4" flat>
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <BaseFileDropField />
<!--
          <DragDrop :uppy="uppy"
                    v-on:ondragover="logEvent"
                    v-on:ondragleave="logEvent"
                    v-on:ondrop="logEvent" />
-->

<!--
          <StatusBar :uppy="uppy" />
-->
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary show a Drag'n'Drop widget to add files for resources
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-11 15:45:56
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import axios from 'axios';

/*
import {
  DragDrop,
  // StatusBar,
} from '@uppy/vue';

import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
// import '@uppy/status-bar/dist/style.css';
*/

import {
  // USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import {
  destoryUppyInstance,
  getUppyInstance,
} from '@/factories/uploadFactory';

import BaseFileDropField from '@/components/BaseElements/BaseFileDropField.vue';

/*
const uppy = getUppyInstance();
*/

const domain = process.env.VUE_APP_ENVIDAT_PROXY;

export default {
  name: 'EditDropResourceFiles',
  props: {
    metadataId: String,
  },
  mounted() {
    this.setupUppy();
  },
  beforeDestroy() {
    destoryUppyInstance();
    this.uppy = null;
  },
  computed: {
    userApiKey() {
      if (this.$store) {
        return this.$store.getters[`${USER_SIGNIN_NAMESPACE}/getUserApiKey`];
      }

      return null;
    },
  },
  methods: {
    setupUppy() {
      if (this.uppy === null) {
        this.uppy = getUppyInstance();
      }

/*
      this.uppy
        .use(GoldenRetriever, { serviceWorker: true })
        .use(AwsS3Multipart, {
          limit: 4,
          getChunkSize(file) {
            // at least 25MB per request, at most 500 requests
            return Math.max(1024 * 1024 * 25, Math.ceil(file.size / 500));
          },
          createMultipartUpload: initiateMultipart,
          prepareUploadParts: requestPresignedUrls,
          listParts: listUploadedParts,
          abortMultipartUpload: abortMultipart,
          completeMultipartUpload: completeMultipart,
        });
*/

      // this.$options.components.DragDrop.o


    },
    async createCKANResource(file) {
      // this.$store.dispatch(
      //   `${USER_NAMESPACE}/METADATA_EDITING_POST_RESOURCE`,
      //   payload,
      // );

      const url = `${domain}/api/action/resource_create`;
      const payload = {
        package_id: this.metadataId,
        url: file.name,
        description: null,
        format: file.extension,
        mimetype: file.type,
        name: file.name,
        size: file.size,
        url_type: 'upload',
        'resource_size-size_value': file.size / 1024 / 1024,
        'resource_size-size_units': 'mb',
        'restricted-level': null,
        'restricted-allowed_users': null,
        'restricted-shared_secret': null,
        doi: null,
        publication_state: null,
        multipart_name: file.name,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        this.resourceId = res.data.result.id;
        // console.log(
        //   `Resource DB entry created in CKAN: ${res.data.result.url}`,
        // );
        return res.data.result.id;
      } catch (error) {
        // console.log(`Error saving resource to CKAN: ${error}`);
        return error;
      }
    },
    async deleteCKANResource() {
      const url = `${domain}/api/action/resource_delete`;

      const payload = {
        id: this.resourceId,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        const success = res.data.success;
        if (success) {
          // console.log(
          //   `Resource DB entry deleted in CKAN: ${this.resourceId}`,
          // );
        } else {
          // console.log(
          //   `Resource deletion in CKAN not successful: ${this.resourceId}`,
          // );
        }
        return success;
      } catch (error) {
        // console.log(`Error deleting resource to CKAN: ${error}`);
        return error;
      }
    },
    logEvent(event) {
      console.log(`Got event ${event}`);
      console.log(event);
    },
  },
  data: () => ({
    uppy: null,
    labels: {
      title: 'Create Resource from Files',
    },
    resourceId: null,
    fileName: null,
    fileSize: null,
    domain,
  }),
  components: {
    BaseFileDropField,
/*
    DragDrop,
    // StatusBar,
*/
  },
};
</script>

<style>
.uppy-Root {
  font-family: 'Raleway', serif !important;
}
</style>
