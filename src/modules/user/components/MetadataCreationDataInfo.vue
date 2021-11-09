<template>
  <v-container id="MetadataCreationDataInfo" fluid class="pa-0">
    <v-row no-gutters>
      <v-col offset="2" cols="8">
        <!-- prettier-ignore -->
        <StepperHeader :steps="steps"
                       activeColor="accent"
                       inactiveColor="secondary"
                       :stepColor="stepColor"
                       :initialStep="currentStepIndex"
                       @stepClick="catchStepClick" />
      </v-col>
    </v-row>

    <v-row class="fill-height">
      <v-col v-if="currentStep" cols="12">
        <component
          :is="currentStep.component"
          v-bind="getGenericPropsForStep(currentStep)"
        />
      </v-col>

      <v-col v-if="!currentStep" cols="12">
        Nothing selected, please select a step in the navigation!
      </v-col>
    </v-row>

    <v-row justify="end" align="end">
      <v-col class="shrink">
        <!-- prettier-ignore -->
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
 * Last modified  : 2021-08-04 10:25:46

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import { EDITMETADATA_NEXT_MAJOR_STEP, eventBus } from '@/factories/eventBus';

import StepperHeader from '@/components/Navigation/StepperHeader';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';

export default {
  name: 'MetadataCreationDataInfo',
  props: {
    steps: Array,
    initialStepTitle: String,
    stepColor: String,
    // stepColor: {
    //   type: String,
    //   default: 'secondary',
    // },
  },
  beforeMount() {
    if (this.initialStepTitle) {
      this.setCurrentStep(this.initialStepTitle);
    } else {
      const first = this.steps?.length > 0 ? this.steps[0] : null;

      this.setCurrentStep(first?.title);
    }
  },
  computed: {},
  methods: {
    getGenericPropsForStep(step) {
      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](step.key);
      }

      return step.genericProps;
    },
    catchStepClick(stepTitle) {
      this.setCurrentStep(stepTitle);
    },
    nextStep() {
      const nextIndex = this.currentStepIndex + 1;
      if (nextIndex > this.steps.length - 1) {
        eventBus.$emit(EDITMETADATA_NEXT_MAJOR_STEP, 'Related Info');
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
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>
