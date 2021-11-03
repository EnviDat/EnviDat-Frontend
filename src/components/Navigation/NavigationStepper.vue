/* eslint-disable vue/no-unused-vars */
<template>
  <div id="NavigationStepper"
                class="pa-0 fill-height stepperContentGrid" >

        <div class="stepper fill-height px-10"
             :style="`background-color: ${backgroundColor}`">

          <StepperHeader class="py-4"
                          :steps="steps"
                          activeColor="accent"
                          inactiveColor="secondary"
                          :stepColor="stepColor"
                          :initialStep="currentStepIndex"
                          @stepClick="catchStepClick" />

        </div>

        <div class="content fill-height pa-1 pt-0"
             :style="`background-color: ${backgroundColor}`">

          <v-card class="fill-height pa-4 ">

            <component v-if="currentStep"
                        :is="currentStep.component"
                        :steps="currentStep.detailSteps"
                        v-bind="currentStep.genericProps"
                        :initialStepTitle="currentStep.initialStepTitle"
                        :stepColor="currentStep.color" />

            <div v-if="!currentStep"
                    cols="12" >
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

import StepperHeader from '@/components/Navigation/StepperHeader';

export default {
  name: 'NavigationStepper',
  props: {
    steps: Array,
    initialStepTitle: String,
    stepColor: String,
  },
  beforeMount() {

    if (this.initialStepTitle) {
      this.setCurrentStep(this.initialStepTitle);
    } else {
      const first = this.steps?.length > 0 ? this.steps[0] : null;

      this.setCurrentStep(first?.title);
    }

  },
  computed: {
    backgroundColor() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.primary : '';
    },
  },
  methods: {
    catchStepClick(stepTitle) {
      this.setCurrentStep(stepTitle);
      // this.$emit('stepClick', step);
    },
    nextStep() {
      let nextIndex = this.currentStepIndex + 1;
      if (nextIndex > this.steps.length - 1) {
        nextIndex = 0;
      }

      this.setCurrentStep(this.steps[nextIndex].title);
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
  },
  data: () => ({
    currentStep: null,
    currentStepIndex: -1,
  }),
  components: {
    StepperHeader,
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
    "stepper"
    "content";
    width: 100%;
    height: 100%;
  }

</style>
