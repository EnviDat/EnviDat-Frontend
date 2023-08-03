/* eslint-disable vue/no-unused-vars */
<template>
  <div id="NavigationStepper"
       class="pa-0 stepperContentGrid"
       :style="`background-color: ${backgroundColor}`" >

    <div class="infoPanel ma-1 py-2 px-3 "
         :class="`infoPanelGrid${$vuetify.breakpoint.mdAndUp ? '-md' : ''}`" >

      <div class="instructions">
        <v-container fluid class="pa-0" >
          <v-row no-gutters>
            <v-col class="metadata_title text-h6 pa-0"
                   :class="$vuetify.breakpoint.smAndDown ? 'compactTitle' : ''" >
              {{ datasetTitleText }}
            </v-col>
          </v-row>

          <v-row class="pt-1"
                 no-gutters>
            <v-col class="flex-grow-0">
              <v-icon color="secondary" class="pr-2">info</v-icon>
            </v-col>
            <v-col>
              <ExpandableLayout cardClass="pa-0"
                                :statusText="isCreationWorkflow ? creationShortInstructions : editingShortInstructions"
                                swapStatusTextWithSoltText
                                :isFlat="true">

                {{ isCreationWorkflow ? creationInstructions : editingInstructions }}

              </ExpandableLayout>
            </v-col>
          </v-row>
        </v-container>

      </div>

      <div class="interaction pl-md-2 py-2 py-sm-0">

        <v-row justify="end">
          <v-col v-if="showPreviewButton"
                 class="shrink">
            <BaseIconButton
                    id="PreviewMetadataButton"
                    material-icon-name="remove_red_eye"
                    icon-color="black"
                    color="black"
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
                    isFancy
                    :is-glowing="showSaveButton"
                    :tooltipBottom="true"
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

          <v-col class="shrink">

            <BaseIconButton
                    id="MetadataEditCloseButton"
                    material-icon-name="close"
                    icon-color="black"
                    color="black"
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
      <StepperHeader class="py-2"
                         :steps="steps"
                         activeColor="accent"
                         inactiveColor="secondary"
                         :stepColor="stepColor"
                         :currentStepIndex="currentStepIndex"
                         @stepClick="catchStepClick" />

      <v-progress-linear v-show="saving"
                         indeterminate
                         color="accent"
                         rounded
                         height="2"
      />

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
import ExpandableLayout from '@/components/Layouts/ExpandableLayout.vue';

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
    saving: {
      type: Boolean,
      default: false,
    },
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
    datasetTitle: {
      type: String,
      default: undefined,
    },
  },
  beforeMount() {
    this.setupSteps();
  },
  mounted() {
    eventBus.on(EDITMETADATA_NEXT_MAJOR_STEP, this.catchStepClick);
  },
  computed: {
    datasetTitleText() {
      let titleText = this.editingTitle;
      if (this.isCreationWorkflow) {
        titleText = this.creationTitle;
      }

      if (!this.datasetTitle) {
        return titleText;
      }

      titleText += ' of ';

      if (this.datasetTitle.length >= 85) {
        titleText += `'${this.datasetTitle.substring(0, 85)} ...'`;
      } else {
        titleText += `'${this.datasetTitle}'`;
      }

      return titleText;
    },
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
    creationTitle: 'Dataset Creation',
    creationShortInstructions: 'This dataset only exists on your computer, fill out all the steps and save it with the disk icon on the top right. Click here to read more.',
    creationInstructions: `While creating a new dataset all the information you enter is stored in your browser on this computer until you save it on the server.
    Fill in the information of all steps and click on the disk icon on the top right to save your dataset on server.
    You will be able to editing everything until you publish it. When adding information either hit the enter key or leave the field (click outside of the field) to save it.`,
    editingTitle: 'Dataset Editing',
    editingShortInstructions: 'Changes are automatically saved, please fill out all the steps to provide the most value for your users. Click here to read more.',
    editingInstructions: `While editing an existing dataset most of the infomation will be auto-saved. Once you have changed information either hit the enter key or leave the field (click outside of the field) to save it.
    Add references to related publications and datasets to provide even more valueable information.`,
  }),
  components: {
    StepperHeader,
    BaseIconButton,
    MetadataCardPlaceholder,
    BaseProgressView,
    ExpandableLayout,
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
