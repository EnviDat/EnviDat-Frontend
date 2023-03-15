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

          <DragDrop :uppy="uppy" />

          <StatusBar :uppy="uppy" />

        </v-col>
      </v-row>

      <v-row class="px-5">
        <v-col v-for="(state, index) in states"
                :key="index"
               :class="index >= states.length - 1 ? 'shrink' : ''"
               >
          <v-row style="align-items: center;">
            <v-col class="shrink">
              <v-chip :color="getStateColor(state)" small>
                {{ state.name }}
              </v-chip>
            </v-col>

            <v-col v-if="index < states.length - 1"
                   class="pa-0" >
              <v-progress-linear :color="getIndicatorColor(state)"
                                 :indeterminate="getIndicatorLoading(state)"
                                 :value="getIndicatorValue(state)"
              />
              </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.instruction2 }}</div>
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
import { destroyUppyInstance, getUppyInstance } from '@/factories/uploadFactory';
import {
  eventBus,
  UPLOAD_STATE_RESET,
  UPLOAD_STATE_RESOURCE_CREATED,
  UPLOAD_STATE_RESOURCE_UPDATED,
  UPLOAD_STATE_UPLOAD_COMPLETED,
  UPLOAD_STATE_UPLOAD_STARTED,
} from '@/factories/eventBus';


export default {
  name: 'EditDropResourceFiles',
  props: {
    metadataId: String,
  },
  created() {
    eventBus.on(UPLOAD_STATE_RESET, this.resetState);
    eventBus.on(UPLOAD_STATE_RESOURCE_CREATED, this.changeState);
    eventBus.on(UPLOAD_STATE_UPLOAD_STARTED, this.changeState);
    eventBus.on(UPLOAD_STATE_UPLOAD_COMPLETED, this.changeState);
    eventBus.on(UPLOAD_STATE_RESOURCE_UPDATED, this.changeState);
  },
  mounted() {
  },
  beforeDestroy() {
    eventBus.off(UPLOAD_STATE_RESET, this.resetState);
    eventBus.off(UPLOAD_STATE_RESOURCE_CREATED, this.changeState);
    eventBus.off(UPLOAD_STATE_UPLOAD_STARTED, this.changeState);
    eventBus.off(UPLOAD_STATE_UPLOAD_COMPLETED, this.changeState);
    eventBus.off(UPLOAD_STATE_RESOURCE_UPDATED, this.changeState);

    destroyUppyInstance();
  },
  computed: {
    uppy () {
      return getUppyInstance(this.metadataId, this.$store);
    },
  },
  methods: {
    getStateColor(state) {
      const index = this.states.findIndex(((s) => s.id === state?.id));
      const currentIndex = this.states.findIndex(((s) => s.id === this.currentState?.id));

      if (currentIndex >= index) {
        return 'primary';
      }

      return 'gray';
    },
    getIndicatorColor(state) {
      const index = this.states.findIndex(((s) => s.id === state?.id));
      const currentIndex = this.states.findIndex(((s) => s.id === this.currentState?.id));

      if (currentIndex >= index) {
        return 'primary';
      }

      return 'grey';
    },
    getIndicatorLoading(state) {
      const index = this.states.findIndex(((s) => s.id === state?.id));
      const currentIndex = this.states.findIndex(((s) => s.id === this.currentState?.id));

      return currentIndex === index;
    },
    getIndicatorValue(state) {
      const index = this.states.findIndex(((s) => s.id === state?.id));
      const currentIndex = this.states.findIndex(((s) => s.id === this.currentState?.id));

      if (index > currentIndex) {
        return undefined;
      }

      return this.getIndicatorLoading(state) ? undefined : 100;
    },
    resetState() {
      this.currentState = null;
    },
    changeState(event) {
      const { id } = event;
      // console.log(event);

      const index = this.states.findIndex(((s) => s.id === id));
      if (index >= 0) {
        this.currentState =this.states[index];
      }

    },
  },
  data: () => ({
    labels: {
      title: 'Create Resource from File',
      instructions: 'Drag and drop a file to upload or click on \'browse\' to pick a file',
      instruction2: 'After uploading make sure to rename the resource and add a description.',
    },
    resourceId: null,
    fileName: null,
    fileSize: null,
    currentState: null,
    states: [
      {
        id: UPLOAD_STATE_RESOURCE_CREATED,
        name: 'create resource',
      },
      {
        id: UPLOAD_STATE_UPLOAD_STARTED,
        name: 'upload started',
      },
      {
        id: UPLOAD_STATE_UPLOAD_COMPLETED,
        name: 'upload finished',
      },
      {
        id: UPLOAD_STATE_RESOURCE_UPDATED,
        name: 'resource updated',
      },
    ],
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
