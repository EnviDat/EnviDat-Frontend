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
          <drag-drop :uppy="uppy" />
          <status-bar :uppy="uppy" />
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

import { DragDrop, StatusBar } from '@uppy/vue';

import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/status-bar/dist/style.css';

import Uppy from '@uppy/core';
import AwsS3Multipart from '@uppy/aws-s3-multipart';

import {
  // USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

export default {
  name: 'EditDropResourceFiles',
  props: {
    metadataId: String,
  },
  beforeMount() {},
  beforeDestroy() {
    this.uppy.close();
  },
  computed: {
    uppy() {
      return new Uppy({
        autoProceed: true,
        logger: Uppy.debugLogger,
        restrictions: {
          maxFileSize: 1024 * 1024 * 1024 * 2, // 20 GB
          maxNumberOfFiles: 1,
          minNumberOfFiles: 1,
        },
      }).use(AwsS3Multipart, {
        limit: 4,
        getChunkSize(file) {
          // at least 25MB per request, at most 500 requests
          return Math.max(1024 * 1024 * 25, Math.ceil(file.size / 500));
        },
        createMultipartUpload: this.initiateMultipart,
        // prepareUploadParts: this.requestPresignedUrls,
        // listParts: this.listUploadedParts,
        // abortMultipartUpload: this.abortMultipart,
        // completeMultipartUpload: this.completeMultipart,
      });
      // .on('upload-success', this.functionToSelectResource()),
      // selecting resource should open the editing component
    },
    userApiKey() {
      if (this.$store) {
        return this.$store.getters[`${USER_SIGNIN_NAMESPACE}/getUserApiKey`];
      }
      return null;
    },
  },
  methods: {
    async createResource(file) {
      // const payload = {
      //   metadataId: this.metadataId,
      //   fileName: file.name,
      //   fileDescription: this.fileDescription,
      //   fileType: file.extension,
      //   fileSize: file.size,
      // };
      // this.$store.dispatch(
      //   `${USER_NAMESPACE}/METADATA_EDITING_POST_RESOURCE`,
      //   payload,
      // );

      const url = 'https://envidat04.wsl.ch/api/action/resource_create';
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
        console.log(
          `Resource DB entry created in CKAN: ${res.data.result.url}`,
        );
        return res.data.result.id;
      } catch (error) {
        console.log(`Error saving resource to CKAN: ${error}`);
        return error;
      }
    },
    async initiateMultipart(file) {
      // const payload = {
      //   resourceId: this.????,
      //   fileName: file.name,
      //   fileSize: file.size,
      // };
      // this.$store.dispatch(
      //   `${USER_NAMESPACE}/METADATA_EDITING_MULTIPART_UPLOAD_INIT`,
      //   payload,
      // );

      const url =
        'https://envidat04.wsl.ch/api/action/cloudstorage_initiate_multipart';

      const payload = {
        id: await this.createResource(file),
        name: file.name,
        size: file.size,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        console.log(`Multipart initiated, upload ID: ${res.data.result.id}`);
        return {
          uploadId: res.data.result.id,
          key: res.data.result.name,
        };
      } catch (error) {
        console.log(`Multipart initiation failed: ${error}`);
        return error;
      }
    },
    async requestPresignedUrls(__, partData) {
      const url =
        'https://envidat04.wsl.ch/api/action/cloudstorage_presign_multipart';

      const payload = {
        uploadId: partData.uploadId,
        uploadKey: partData.key,
        partNumbersList: partData.partNumbers,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        console.log(`Presigned urls recieved: ${res.data.result.urls}`);
        return {
          presignedUrls: res.data.result.urls,
          headers: res.data.result?.headers,
        };
        // API Return Format
        // {
        //   "presignedUrls": {
        //     "1": "https://bucket.region.amazonaws.com/path/to/file.jpg?partNumber=1&...",
        //     "2": "https://bucket.region.amazonaws.com/path/to/file.jpg?partNumber=2&...",
        //     "3": "https://bucket.region.amazonaws.com/path/to/file.jpg?partNumber=3&..."
        //   },
        //   "headers": { "some-header": "value" }
        // }
      } catch (error) {
        console.log(`Presigning urls failed: ${error}`);
        return error;
      }
    },
    async completeMultipart(file, uploadData) {
      const url =
        'https://envidat04.wsl.ch/api/action/cloudstorage_finish_multipart';

      const payload = {
        uploadId: uploadData.uploadId,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        console.log(`Multipart upload complete, ID: ${uploadData.uploadId}`);
        return file?.url;
      } catch (error) {
        console.log(`Multipart completion failed: ${error}`);
        return error;
      }
    },
    async abortMultipart(__, uploadData) {
      const url =
        'https://envidat04.wsl.ch/api/action/cloudstorage_abort_multipart';

      const payload = {
        id: this.metadataId,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        console.log(
          `Multipart upload aborted. Metadata ID ${this.metadataId} | S3 Upload ID ${uploadData.uploadId}`,
        );
        return {}
      } catch (error) {
        console.log(
          `Multipart abort failed for Metadata ID ${this.metadataId}: ${error}`,
        );
        return error;
      }
    },
    async listUploadedParts(file, uploadData) {
      const url =
        'https://envidat04.wsl.ch/api/action/cloudstorage_check_multipart';

      const payload = {
        id: this.metadataId,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        console.log(`Multipart details: ${res.data.result.upload}`);
        // CHECK CKAN API TO SEE WHAT IS RETURNED
        // REQUIRE A LIST OF S3 Part OBJECTS
        return res.data.result.upload.parts;
      } catch (error) {
        console.log(`Checking multipart details failed: ${error}`)
        return error;
      }
    },
  },
  data: () => ({
    labels: {
      title: 'Create Resource from Files',
    },
    resourceId: null,
  }),
  components: {
    DragDrop,
    StatusBar,
  },
};
</script>

<style>
.uppy-Root {
  font-family: 'Raleway', serif !important;
}
</style>
