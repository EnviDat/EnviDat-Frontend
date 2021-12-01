/* eslint-disable vue/no-unused-vars */
<template>
  <div id="NavigationStepper" class="pa-0 fill-height stepperContentGrid">

    <div class="stepper fill-height pl-10 headerContentGrid"
          :style="`background-color: ${backgroundColor}`" >

      <!-- prettier-ignore -->
      <StepperHeader class="py-4"
                         :steps="steps"
                         activeColor="accent"
                         inactiveColor="secondary"
                         :stepColor="stepColor"
                         :stepNumber="currentStepIndex"
                         @stepClick="catchStepClick" />

      <BaseIconButton id="MetadataEditCloseButton"
                      class="ma-auto px-4"
                      material-icon-name="close"
                      icon-color="white"
                      color="white"
                      outlined
                      tooltipText="Close metadata editing"
                      :tooltipBottom="true"
                      @clicked="catchCloseClick" />

    </div>
    
    <div
      class="content fill-height pa-1 pt-0"
      :style="`background-color: ${backgroundColor}`"
    >
      <v-card class="fill-height pa-4">
        <!-- prettier-ignore -->
        <component v-if="currentStep"
                       :is="currentStep.component"
                       :steps="currentStep.detailSteps"
                       v-bind="currentStep.genericProps"
                       :stepTitle="subStep || currentStep.stepTitle"
                       :stepColor="currentStep.color"
                       :readOnlyFields="currentStep.readOnlyFields"
                       :readOnlyExplanation="currentStep.readOnlyExplanation"
                       :nextMajorStep="getNextMajorStepTitle()" />

        <div v-if="!currentStep" >
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

import { EDITMETADATA_NEXT_MAJOR_STEP, eventBus } from '@/factories/eventBus';

import StepperHeader from '@/components/Navigation/StepperHeader';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

export default {
  name: 'NavigationStepper',
  props: {
    steps: Array,
    step: String,
    subStep: String,
    stepColor: String,
    nextMajorStep: String,
  },
  beforeMount() {
    this.setupSteps();
  },
  mounted() {
    eventBus.$on(EDITMETADATA_NEXT_MAJOR_STEP, this.catchStepClick);
  },
  computed: {
    backgroundColor() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.primary : '';
    },
  },
  watch: {
    step() {
      this.setupSteps();
    },
  },
  methods: {
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
      this.$router.push({
        params: {
          step: stepTitle,
          substep: undefined,
        },
        query: this.$route.query,
      });
    },
    nextStep() {
      let nextIndex = this.currentStepIndex + 1;
      if (nextIndex > this.steps.length - 1) {
        nextIndex = 0;
      }

      this.$router.push({ params: {
        step: this.steps[nextIndex].title,
      }});
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
      this.$emit('clickedClose')
    },
  },
  data: () => ({
    currentStep: null,
    currentStepIndex: -1,
  }),
  components: {
    StepperHeader,
    BaseIconButton,
  },
};
</script>

<style scoped>
.stepperContentGrid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 0.5fr 6fr;
  gap: 0;
  grid-template-areas:
    'stepper'
    'content';
  width: 100%;
  height: 100%;
}

.headerContentGrid {
  display: grid;
  grid-template-columns: 11fr auto;
  gap: 0;
  width: 100%;
  height: 100%;
}
</style>
