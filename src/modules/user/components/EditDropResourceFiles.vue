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
import { destoryUppyInstance, getUppyInstance } from '@/factories/uploadFactory';


export default {
  name: 'EditDropResourceFiles',
  props: {
    metadataId: String,
  },
  mounted() {
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
