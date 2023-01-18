<template>
  <v-card id="EditDropResourceFiles" class="pa-4" >
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">

          <DragDrop :uppy="uppy"
                    @onDragOver="logEvent"
                    @onDragLeave="logEvent"
                    @onDrop="logEvent" />

          <StatusBar :uppy="uppy" />

        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1 highlight">{{ labels.instruction2 }}</div>
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

import {
  DragDrop,
  StatusBar,
} from '@uppy/vue';

import '@uppy/core/dist/style.css';
import '@uppy/drag-drop/dist/style.css';
import '@uppy/status-bar/dist/style.css';

/*
import Uppy, { debugLogger } from '@uppy/core';
import Tus from '@uppy/tus';
*/
import { destoryUppyInstance, getUppyInstance, subscribeOnUppyEvent } from '@/factories/uploadFactory';


export default {
  name: 'EditDropResourceFiles',
  props: {
    metadataId: String,
  },
  mounted() {
    subscribeOnUppyEvent('complete', this.emitEvent);
  },
  beforeDestroy() {
    // this.uppy.close({ reason: 'unmount' });
    destoryUppyInstance();
  },
  computed: {
    uppy () {
      return getUppyInstance(this.metadataId, this.$store);

/*
      return new Uppy({
          logger: debugLogger,
          restrictions: {
            maxNumberOfFiles: 1,
          },
      })
      .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' }); // .use(DropTarget, { target: document.body });
*/
    },
  },
  methods: {
    emitEvent(event) {
      this.$emit(event);
    },
/*
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
    */
    logEvent(event) {
      console.log(`Got event ${event}`);
      console.log(event);
    },
  },
  data: () => ({
    labels: {
      title: 'Create Resource from File',
      instructions: 'Drag and drop a file to upload or click on \'browse\' to pick a file',
      instruction2: 'After uploading make sure to rename the resources!',
    },
    resourceId: null,
    fileName: null,
    fileSize: null,
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
