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
import GoldenRetriever from '@uppy/golden-retriever';

import {
  // USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

const domain = process.env.VUE_APP_ENVIDAT_PROXY;

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
        debug: false,
        // logger: Uppy.debugLogger,
        restrictions: {
          maxFileSize: 1024 * 1024 * 1024 * 20, // 20 GB
          maxNumberOfFiles: 1,
          minNumberOfFiles: 1,
        },
      })
        .use(GoldenRetriever, { serviceWorker: true })
        .use(AwsS3Multipart, {
          limit: 4,
          getChunkSize(file) {
            // at least 25MB per request, at most 500 requests
            return Math.max(1024 * 1024 * 25, Math.ceil(file.size / 500));
          },
          createMultipartUpload: this.initiateMultipart,
          prepareUploadParts: this.requestPresignedUrls,
          listParts: this.listUploadedParts,
          abortMultipartUpload: this.abortMultipart,
          completeMultipartUpload: this.completeMultipart,
        })
        .on('upload-complete', this.$emit('uploadComplete', 'Done'));
    },
    files() {
      return [
        {
          name: this.fileName,
          size: this.fileSize,
          type: this.fileType,
        },
      ];
    },
    userApiKey() {
      if (this.$store) {
        return this.$store.getters[`${USER_SIGNIN_NAMESPACE}/getUserApiKey`];
      }
      return null;
    },
  },
  methods: {
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
    async initiateMultipart(file) {
      // this.$store.dispatch(
      //   `${USER_NAMESPACE}/METADATA_EDITING_MULTIPART_UPLOAD_INIT`,
      //   payload,
      // );

      this.fileName = file.name;
      this.fileSize = file.size;
      this.fileType = file.type;
      this.$emit('createResources', this.files);

      const url = `${domain}/api/action/cloudstorage_initiate_multipart`;

      const payload = {
        // id: await this.createCKANResource(file),
        id: '',
        name: file.name,
        size: file.size,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        return {
          uploadId: res.data.result.id,
          key: res.data.result.name,
        };
      } catch (error) {
        // console.log(`Multipart initiation failed: ${error}`);
        return error;
      }
    },
    async requestPresignedUrls(file, partData) {
      const url = `${domain}/api/action/cloudstorage_get_presigned_url_list_multipart`;

      const payload = {
        id: this.resourceId,
        uploadId: partData.uploadId,
        partNumbersList: partData.partNumbers,
        filename: file.name,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        return {
          presignedUrls: res.data.result.presignedUrls,
          // headers: {
          //   'Content-Type': 'application/octet-stream',
          // },
        };
      } catch (error) {
        // console.log(`Presigning urls failed: ${error}`);
        return error;
      }
    },
    async completeMultipart(file, uploadData) {
      const url = `${domain}/api/action/cloudstorage_finish_multipart`;

      const payload = {
        id: this.resourceId,
        uploadId: uploadData.uploadId,
        partInfo: JSON.stringify(uploadData.parts),
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        return { location: await res.data.result.url };
      } catch (error) {
        // console.log(`Multipart completion failed: ${error}`);
        return error;
      }
    },
    async abortMultipart(__, uploadData) {
      const url = `${domain}/api/action/cloudstorage_abort_multipart`;

      const payload = {
        id: this.resourceId,
        deletedInCKAN: await this.deleteCKANResource(),
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        // console.log(
        //   `Multipart upload aborted. Resource ID ${this.resourceId} | S3 Upload ID ${uploadData.uploadId}`,
        // );
        return {};
      } catch (error) {
        // console.log(
        //   `Multipart abort failed for Resource ID ${this.resourceId}: ${error}`,
        // );
        return error;
      }
    },
    async listUploadedParts(__, uploadData) {
      const url = `${domain}/api/action/cloudstorage_multipart_list_parts`;

      const payload = {
        uploadId: uploadData.uploadId,
        uploadKey: uploadData.key,
      };

      try {
        const res = await axios.post(url, payload, {
          headers: {
            Authorization: this.userApiKey,
          },
        });
        console.log(`Multipart parts: ${res.data.result}`);
        return res.data.result;
      } catch (error) {
        console.log(`Listing multipart parts failed: ${error}`);
        return error;
      }
    },
  },
  data: () => ({
    labels: {
      title: 'Create Resource from Files',
    },
    resourceId: null,
    fileName: null,
    fileSize: null,
    domain,
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
