/* eslint-disable vue/no-unused-vars */
<template>
  <div id="NavigationStepper"
       class="pa-0 stepperContentGrid">

    <div class="infoPanel pa-2 pa-sm-4"
         :class="`infoPanelGrid${$vuetify.breakpoint.mdAndUp ? '-md' : ''}`"
         :style="`background-color: ${backgroundColor}`" >

      <div class="instructions">
        <div class="white--text readableText">
          <v-icon color="white">info</v-icon>
          {{ isCreationWorkflow ? creationWorkflowInstruction : editingWorkflowInstruction }}
        </div>

      </div>

      <div class="interaction py-2 py-sm-0">

        <v-row justify="end">
          <v-col v-if="showPreviewButton"
                 class="shrink">
            <BaseIconButton
                    id="PreviewMetadataButton"
                    material-icon-name="remove_red_eye"
                    icon-color="white"
                    color="white"
                    outlined
                    tooltipText="Preview Dataset"
                    :tooltipBottom="true"
                    @clicked="catchPreviewClick"
            />
          </v-col>

          <v-col v-if="isCreationWorkflow"
                  class="shrink">
            <BaseIconButton
                    id="SaveMetadataButton"
                    material-icon-name="save"
                    icon-color="black"
                    color="black"
                    outlined
                    tooltipText="Save Dataset On the Server"
                    :disabled="!showSaveButton"
                    :isFancy="showSaveButton"
                    :tooltipBottom="true"
                    @clicked="catchSaveDatasetClick"
            />
          </v-col>

          <v-col v-if="isCreationWorkflow" >
              <BaseProgressView :text="creationProgressInfo"
                                text-color="white"
                                :progress-pct="completedPct"
                                color="white"
              />
          </v-col>

          <v-col v-if="!isCreationWorkflow" >
              <BaseProgressView :text="editingProgressInfo"
                                text-color="white"
                                :progress-pct="completedPct"
                                color="white"
              />
          </v-col>

          <v-col class="shrink">

            <BaseIconButton
                    id="MetadataEditCloseButton"
                    material-icon-name="close"
                    icon-color="white"
                    color="white"
                    outlined
                    tooltipText="Close workflow"
                    :tooltipBottom="true"
                    @clicked="catchCloseClick"
            />
          </v-col>

        </v-row>
      </div>
    </div>

    <div class="stepper px-5 headerContentGrid"
          :style="`background-color: ${backgroundColor}`"
    >
      <!-- prettier-ignore -->
      <StepperHeader class="py-2 py-sm-4"
                         :steps="steps"
                         activeColor="accent"
                         inactiveColor="secondary"
                         :stepColor="stepColor"
                         :currentStepIndex="currentStepIndex"
                         @stepClick="catchStepClick" />

    </div>

    <div
      class="content fill-height pa-1 pt-0"
      :style="`background-color: ${backgroundColor}`"
    >
      <v-card v-show="loading" class="fill-height pa-4">
        <v-row id="metadataListPlaceholder">
          <v-col
            v-for="(n, index) in 2"
            :key="'placeHolder_' + index"
            class="pa-2"
          >
            <MetadataCardPlaceholder :dark="false" />
          </v-col>
        </v-row>
      </v-card>

      <v-card v-if="!loading" class="fill-height pa-4">
        <!-- prettier-ignore -->
        <component v-if="currentStep"
                       :is="currentStep.component"
                       :currentStep="currentStep"
                       :steps="currentStep.detailSteps"
                       v-bind="currentStep.genericProps"
                       :stepTitle="subStep || currentStep.stepTitle"
                       :stepColor="currentStep.color"
                       :readOnlyFields="currentStep.readOnlyFields"
                       :readOnlyExplanation="currentStep.readOnlyExplanation"
                       :nextMajorStep="getNextMajorStepTitle()"
                       :isCreationWorkflow="isCreationWorkflow" />

        <div v-if="!currentStep">
          Nothing selected, please select a step in the navigation!
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
/**

 * @summary NavigationStepper for structuring a workflow
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-29 13:51:43
 * Last modified  : 2021-08-03 16:45:29

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseProgressView from '@/components/BaseElements/BaseProgressView.vue'
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import StepperHeader from '@/components/Navigation/StepperHeader.vue';
import { EDITMETADATA_NEXT_MAJOR_STEP, eventBus } from '@/factories/eventBus';
import { countSteps } from '@/factories/userCreationFactory';

export default {
  name: 'NavigationStepper',
  props: {
    steps: Array,
    step: String,
    subStep: String,
    stepColor: String,
    nextMajorStep: String,
    loading: {
      type: Boolean,
      default: false,
    },
    showPreviewButton: {
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
  },
  beforeMount() {
    this.setupSteps();
  },
  mounted() {
    eventBus.on(EDITMETADATA_NEXT_MAJOR_STEP, this.catchStepClick);
  },
  computed: {
    backgroundColor() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.primary : '';
    },
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
  watch: {
    step() {
      this.setupSteps();
    },
  },
  methods: {
    getCompletedAmount() {
      return this.steps.filter((s) => s.complete === true).length;
    },
    getNextMajorStepTitle() {
      const nextMajorIndex = this.currentStepIndex + 1;

      if (nextMajorIndex > this.steps.length - 1) {
        return this.steps[0].title;
      }

      return this.steps[nextMajorIndex].title;
    },
    setupSteps() {
      if (this.step) {
        this.setCurrentStep(this.step);
      } else {
        const first = this.steps?.length > 0 ? this.steps[0] : null;

        this.setCurrentStep(first?.title);
      }
    },
    catchStepClick(stepTitle) {

      if (!this.$router) {
        // storybook context
        this.setCurrentStep(stepTitle);
        return;
      }

      this.$router.push(
        {
          params: {
            step: stepTitle,
            substep: undefined,
          },
          query: this.$route.query,
        },
        () => {},
        err => {
          // add empty onAbort to not trigger the NavigationDuplicated Error message
          // when it's a NavigationDuplicated Error
          if (err?.name?.toLowerCase() !== 'navigationduplicated') {
            // eslint-disable-next-line no-console
            console.error(err);
          }
        },
      );

    },
    nextStep() {
      let nextIndex = this.currentStepIndex + 1;
      if (nextIndex > this.steps.length - 1) {
        nextIndex = 0;
      }

      this.$router.push({
        params: {
          step: this.steps[nextIndex].title,
        },
      });
    },
    // eslint-disable-next-line no-unused-vars
    setCurrentStep(stepTitle) {
      if (this.steps) {
        for (let i = 0; i < this.steps.length; i++) {
          const s = this.steps[i];
          s.active = s.title === stepTitle;

          if (s.active) {
            this.currentStep = s;
            this.currentStepIndex = i;
            return;
          }
        }
      }

      this.currentStepIndex = -1;
      this.currentStep = null;
    },
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
  data: () => ({
    currentStep: null,
    currentStepIndex: -1,
    creationWorkflowInstruction: `You are creating a new dataset.
    There is a minimum of information you have to fill out until you can save a dataset on the server.
    `,
    editingWorkflowInstruction: `You are editing an existing dataset.
    For editing most of the infomation will be auto-saved. Once you have changed information just click away to save it.`,
  }),
  components: {
    StepperHeader,
    BaseIconButton,
    MetadataCardPlaceholder,
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
    gap: 50px;
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
</style>
