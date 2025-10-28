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

        </v-col>

        <v-col cols="12">
          <!-- unmount of Statusbar from uppy-vue throws an error therefore use it directly -->
          <div id="uppy-status-bar"> </div>
        </v-col>


        <v-col v-show="error"
               cols="12"
                class="py-0">
          <BaseStatusLabelView :statusText="error"
                               :expandedText="errorDetails"
                               :showExpandIcon="!!errorDetails"
                               status="error"
                               statusColor="error"
                               />
        </v-col>

        <v-col v-show="error"
               cols="12"
               class="text-body-1"
                v-html="legacyInstruction">

        </v-col>


      </v-row>

      <v-row class="px-5">
        <v-col v-for="(state, index) in states"
                :key="index"
               :class="index >= states.length - 1 ? 'flex-grow-0' : ''"
               >
          <v-row style="align-items: center;">
            <v-col class="flex-grow-0">
              <TagChip :color="getStateColor(state)"
                       :isSmall="true"
                        :name="state.name" />
            </v-col>

            <v-col v-if="index < states.length - 1"
                   class="pa-0" >
              <v-progress-linear :color="getStateColor(state)"
                                 :indeterminate="getIndicatorLoading(state)"
                                 :model-value="getIndicatorValue(state)"
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
 * Last modified  : 2025-10-15 14:30:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { DragDrop } from '@uppy/vue';
import StatusBar from '@uppy/status-bar';

import '@uppy/core/dist/style.min.css';
import '@uppy/drag-drop/dist/style.min.css';
import '@uppy/status-bar/dist/style.min.css';

import { getUppyInstance } from '@/factories/uploadFactory';
import {
/*
  eventBus,
  UPLOAD_STATE_RESET,
*/
  UPLOAD_STATE_RESOURCE_CREATED,
  UPLOAD_STATE_UPLOAD_COMPLETED,
  UPLOAD_STATE_UPLOAD_PROGRESS,
  UPLOAD_STATE_UPLOAD_STARTED,
} from '@/factories/eventBus';

import TagChip from '@/components/Chips/TagChip.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';

const statusBarId = 'statusBar-plugin';

export default {
  name: 'EditDropResourceFiles',
  props: {
    metadataId: String,
    legacyUrl: {
      type: String,
      default: undefined,
    },
    state: String,
    progress: Number,
    error: String,
    errorDetails: String,
  },
  computed: {
    uppy () {
      return getUppyInstance(this.metadataId, this.$store);
    },
    legacyInstruction() {
      return `Please retry uploading, if it still doesn't work please let us know! And give it a try via the <a href="${this.legacyUrl}" target="_blank">legacy website </a>. To upload a new file cancel it first via the little close-icon (x).`;
    },
  },
  mounted() {
    if (!this.uppy.getPlugin(statusBarId)) {
      this.uppy.use(StatusBar, {
        id: statusBarId,
        target: '#uppy-status-bar',
      });
    }
  },  
  methods: {
    getStateColor(state) {

      if (!this.currentState) {
        return 'grey-lighten-2';
      }

      const index = this.states.findIndex(s => s.id === state?.id);
      const currentIndex = this.states.findIndex(s => s.id === this.currentState?.id);

      return currentIndex >= index ? 'primary' : 'grey-lighten-2';
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
      // console.log('resetState');
      this.currentState = null;
      this.states = [
        {
          id: UPLOAD_STATE_UPLOAD_STARTED,
          name: 'upload started',
        },
        {
          id: UPLOAD_STATE_RESOURCE_CREATED,
          name: 'resource created',
        },
        {
          id: UPLOAD_STATE_UPLOAD_PROGRESS,
          name: 'uploading file',
        },
        {
          id: UPLOAD_STATE_UPLOAD_COMPLETED,
          name: 'upload finished',
        },
      ];
    },
    changeState(id, progress) {
      if (!this.states) {
        return;
      }

      // console.log('Change State', id, progress);

      const index = this.states.findIndex(((s) => s.id === id));

      if (index >= 0) {
        const state = this.states[index];

        if (id === UPLOAD_STATE_UPLOAD_PROGRESS) {
          state.name = `uploading file ${progress}%`;
          // console.log('Change progress', state.name);
        }

        this.states[index] = state;
        this.currentState = state;
      }

    },
  },
  watch: {
    progress() {
      this.changeState(this.currentState.id, this.progress)
    },    
    state: {
      handler(newState) {
        if (newState) {
          this.changeState(newState, this.progress)
        } else {
          this.resetState();
        }
      },
      immediate: true,
    },
  },
  data: () => ({
    labels: {
      title: 'Create Resource from File',
      instructions: 'Drag and drop a file to upload or click on \'browse\' to pick a file. If you have files larger then 2 GB please contact the EnviDat team.',
      instruction2: 'When uploading is finished, please make sure to rename the resource and add a description. The resource will be automatically selected.',
    },
    resourceId: null,
    fileName: null,
    fileSize: null,
    currentState: null,
    states: [
      {
        id: UPLOAD_STATE_UPLOAD_STARTED,
        name: 'upload started',
      },
      {
        id: UPLOAD_STATE_RESOURCE_CREATED,
        name: 'resource created',
      },
      {
        id: UPLOAD_STATE_UPLOAD_PROGRESS,
        name: 'uploading file',
      },
      {
        id: UPLOAD_STATE_UPLOAD_COMPLETED,
        name: 'upload finished',
      },
    ],
  }),
  components: {
    DragDrop,
    TagChip,
    BaseStatusLabelView,
  },
};
</script>

<style>
.uppy-Root {
  font-family: 'Raleway', serif !important;
}
</style>
