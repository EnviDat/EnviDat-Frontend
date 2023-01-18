<template>
  <v-card id="EditMultiDropResourceFiles" class="pa-4" >
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

          <dashboard :uppy="uppy"
                     :props="{theme: 'light'}" />


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


import { Dashboard } from '@uppy/vue';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { destoryUppyInstance, getUppyInstance } from '@/factories/uploadFactory';


export default {
  name: 'EditMultiDropResourceFiles',
  props: {
    metadataId: String,
  },
  mounted() {
  },
  beforeDestroy() {
    destoryUppyInstance();
  },
  computed: {

    uppy () {
      return getUppyInstance(this.metadataId, this.$store, 300, false, true, this.multiUploadRestrictions);

/*
      return new Uppy({ logger: debugLogger })
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
      title: 'Create Multiple Resources from Files',
      instructions: 'Drag and drop multiple files to upload or click on \'browse\' to pick files.',
      instruction2: 'After uploading make sure to rename the resources!',
    },
    resourceId: null,
    fileName: null,
    fileSize: null,
    multiUploadRestrictions: {
      maxFileSize: 1024 * 1024 * 1024 * 20, // KB * MB * GB * 20 = 20 GB
      maxNumberOfFiles: 5,
      minNumberOfFiles: 1,
    },
  }),
  components: {
    Dashboard,
  },
};
</script>

<style>
.uppy-Root {
  font-family: 'Raleway', serif !important;
}
</style>
