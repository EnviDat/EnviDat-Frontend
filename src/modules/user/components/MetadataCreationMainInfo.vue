<template>
  <v-container id="MetadataCreationMainInfo"
                fluid
                class="pa-0">

    <v-row no-gutters >
      <v-col offset="1" cols="10">
<!--        <v-card >-->
          <StepperHeader :steps="steps"
                          activeColor="accent"
                          inactiveColor="primary"
                          :stepColor="stepColor"
                          :initialStep="currentStepIndex"
                          @stepClick="catchStepClick" />

<!--        </v-card>-->
      </v-col>
    </v-row>

    <v-row class="fill-height">
      <v-col v-if="currentStep"
              cols="12" >
        <component :is="currentStep.component"
                    :genericProps="currentStep.genericProps"
                    />
      </v-col>

      <v-col v-if="!currentStep"
              cols="12" >
        Nothing selected, please select a step in the navigation!
      </v-col>
    </v-row>

    <v-row justify="end" align="end" >
      <v-col class="shrink">
        <BaseRectangleButton buttonText="Next Step"
                              @clicked="nextStep" />
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
/**

 * @summary MetadataCreationMainInfo provides the different steps for editing the main info a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-29 13:51:43
 * Last modified  : 2021-08-12 17:33:21

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import StepperHeader from '@/components/Navigation/StepperHeader';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'MetadataCreationMainInfo',
  props: {
    steps: Array,
    initialStepTitle: String,
    stepColor: String,
  },
  beforeMount() {
    this.setInitialStep();
  },
  computed: {
  },
  methods: {
    catchStepClick(stepTitle) {
      this.setCurrentStep(stepTitle);
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
    setInitialStep() {
      if (this.initialStepTitle) {
        this.setCurrentStep(this.initialStepTitle);
      } else {
        const first = this.steps?.length > 0 ? this.steps[0] : null;

        this.setCurrentStep(first?.title);
      }
    },
  },
  watch: {
    initialStepTitle() {
      // used when navigating from a first detail step to another main step,
      // to step on the initial detail step of the new main step
      this.setInitialStep();
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
