/* eslint-disable vue/no-unused-vars */
<template>
  <v-container fluid class="pa-0" >

    <v-row justify="end">

      <v-col v-if="showPreviewButton" class="flex-grow-0">
        <BaseIconButton
          class="previewMetadataButton"
          :icon="mdiEye"
          icon-color="black"
          color="black"
          outlined
          tooltip-text="Preview Dataset"
          :tooltip-bottom="true"
          @clicked="catchPreviewClick"
        />
      </v-col>

      <v-col v-if="isCreationWorkflow" class="flex-grow-0">
        <BaseIconButton
          class="saveMetadataButton"
          :icon="mdiContentSave"
          icon-color="black"
          color="black"
          outlined
          tooltip-text="Save Dataset On the Server"
          :disabled="!showSaveButton"
          fancy
          :glowing="showSaveButton"
          :tooltip-bottom="true"
          @clicked="catchSaveDatasetClick"
        />
      </v-col>

      <v-col v-if="showProgress && isCreationWorkflow" >
        <BaseProgressView :text="creationProgressInfo"
                          :progress-pct="completedPct"
                          color="secondary"
        />
      </v-col>

      <v-col v-if="showProgress && !isCreationWorkflow" >
          <BaseProgressView :text="editingProgressInfo"
                            :progress-pct="completedPct"
                            color="secondary"
          />
      </v-col>

      <v-col class="flex-grow-0">
        <BaseIconButton
          class="metadataEditCloseButton"
          :icon="mdiClose"
          icon-color="black"
          color="black"
          outlined
          tooltip-text="Close workflow"
          tooltip-bottom
          @clicked="catchCloseClick"
        />
      </v-col>

    </v-row>

    <v-row >
      <v-container fluid class="fill-height py-0" >
        <v-row no-gutters align-content="end">
          <v-col v-if="message" >
            <BaseStatusLabelView statusIcon="check"
                                 statusColor="success"
                                 :statusText="message"
                                 :expandedText="messageDetails" />
          </v-col>

          <v-col v-if="error" >
            <BaseStatusLabelView statusIcon="error"
                                 statusColor="error"
                                 :statusText="error"
                                 :expandedText="errorDetails" />
          </v-col>
        </v-row>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
/**

 * @summary Stepper Interaction View
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseProgressView from '@/components/BaseElements/BaseProgressView.vue'

import { countSteps } from '@/factories/userCreationFactory';
import { mdiClose, mdiContentSave, mdiEye } from '@mdi/js';

export default {
  name: 'StepperInteractionView',
  props: {
    steps: Array,
    showPreviewButton: {
      type: Boolean,
      default: false,
    },
    showProgress: {
      type: Boolean,
      default: false,
    },
    showSaveButton: {
      type: Boolean,
      default: false,
    },
    isCreationWorkflow: {
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
  },
  computed: {
    completedPct() {
      const pct = this.completedStepsAmount / this.allStepsAmount;
      const pct2 = (pct * 100).toFixed(2);
      return Number.parseFloat(pct2);
    },
    completedPctInteger() {
      return Math.floor(this.completedPct);
    },
    completedStepsAmount() {
      return countSteps(this.steps, true);
    },
    creationProgressInfo() {
      if (this.completedPct >= 100) {
        return 'Ready to save!'
      }

      if (this.completedPct >= 50) {
        return 'A few infos more!'
      }

      return 'Enter all info to save!'
    },
    editingProgressInfo() {
      if (this.completedPct >= 100) {
        return 'Excellent!'
      }

      if (this.completedPct >= 70) {
        return 'Almost there!'
      }

      return 'Provide more info!'
    },
    allStepsAmount() {
      return countSteps(this.steps);
    },
  },
  methods: {
    catchCloseClick() {
      this.$emit('clickedClose');
    },
    catchPreviewClick() {
      this.$emit('clickedPreview');
    },
    catchSaveDatasetClick() {
      this.$emit('clickedSaveDataset');
    },
  },
  components: {
    BaseIconButton,
    BaseProgressView,
  },
};
</script>

<style scoped>
.stepperContentGrid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto 72px minmax(auto, 1fr);
  gap: 0;
  grid-template-areas:
    'infoPanel'
    'stepper'
    'content';
  width: 100%;
  height: 100%;
}

.infoPanel {
  background-color: white;
  border-radius: 5px;
}

.infoPanelGrid {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: auto;
  gap: 0;
  grid-template-areas:
  'instructions'
  'interaction';
}

.infoPanelGrid-md {
  display: grid;
  grid-template-columns: 5fr auto;
  gap: 30px;
  grid-template-areas:
  'instructions interaction';
}

.instructions {
    display: flex;
    justify-content: start;
}

.interaction {
  display: flex;
  justify-content: end;
}

.compactTitle {
  line-height: 1.5rem !important;
}
</style>
