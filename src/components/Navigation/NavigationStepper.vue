/* eslint-disable vue/no-unused-vars */
<template>
  <v-container id="NavigationStepper"
                fluid
                class="pa-0">

    <v-row no-gutters
            :style="`background-color: ${backgroundColor}`" >
      <v-col cols="12">
        <StepperHeader :steps="steps"
                        activeColor="accent"
                        inactiveColor="primary"
                        :stepColor="stepColor"
                        :initialStep="currentStepIndex"
                        @stepClick="catchStepClick" />

      </v-col>
    </v-row>
    <v-row no-gutters >
      <v-col cols="12" 
              :style="`background-color: ${backgroundColor}`">

        <v-card style="background-color: white;"
                class="ma-1 pa-4">

          <v-row>
            <v-col cols="12" >
              
              <div v-if="currentStep">
                <component :is="currentStep.component"
                            :steps="currentStep.detailSteps"
                            :genericProps="currentStep.genericProps"
                            stepColor="highlight" />
              </div>

              <div v-if="!currentStep">
                Nothing selected, please select a step in the navigation!
              </div>
            </v-col>
          </v-row>

        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
/**

 * @summary NavigationStepper for structuring a workflow
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-29 13:51:43
 * Last modified  : 2021-07-28 17:29:54

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import {
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import StepperHeader from '@/components/Navigation/StepperHeader';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton'

export default {
  name: 'NavigationStepper',
  props: {
    steps: Array,
    initialStepTitle: String,
    stepColor: {
      type: String,
      default: 'secondary',
    },
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
    setCurrentStep(stepTitle) {

      for (let i = 0; i < this.steps.length; i++) {
        const s = this.steps[i];
        s.active = s.title === stepTitle;

        if (s.active) {
          this.currentStep = s;
          this.currentStepIndex = i;
          return;
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
    BaseRectangleButton,
  },  
};
</script>

<style scoped>


</style>
