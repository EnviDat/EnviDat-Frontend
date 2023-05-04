<template>
  <v-container id="MetadataGenericSubStepper" fluid class="pa-0">
    <v-row no-gutters>
      <v-col class="px-10">
        <!-- prettier-ignore -->
        <StepperHeader  :steps="steps"
                        activeColor="accent"
                        inactiveColor="secondary"
                        :stepColor="stepColor"
                        :currentStepIndex="currentStepIndex"
                        @stepClick="catchStepClick" />
      </v-col>
    </v-row>

    <v-row class="fill-height">
      <v-col v-if="currentStep" cols="12">
        <component
          :is="currentStep.component"
          v-bind="getGenericPropsForStep(currentStep)"
          :metadataId="metadataId"
          :readOnlyFields="currentStep.readOnlyFields"
          :readOnlyExplanation="currentStep.readOnlyExplanation"
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

 * @summary MetadataGenericSubStepper provides the different steps for editing the main info for a metadata entry
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-29 13:51:43
 * Last modified  : 2021-08-12 17:33:21

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import StepperHeader from '@/components/Navigation/StepperHeader.vue';
import { EDITMETADATA_NEXT_MAJOR_STEP, eventBus } from '@/factories/eventBus';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';

export default {
  name: 'MetadataGenericSubStepper',
  props: {
    steps: Array,
    stepTitle: String,
    stepColor: String,
    nextMajorStep: String,
  },
  beforeMount() {
    this.setupStep();
  },
  computed: {
    metadataId() {
      return this.$route?.params?.metadataid || undefined;
    },
  },
  methods: {
    getGenericPropsForStep(step) {
      if (step.genericProps) {
        return step.genericProps;
      }

      if (this.$store) {
        return this.$store.getters[
          `${USER_NAMESPACE}/getMetadataEditingObject`
        ](step.key);
      }

      return undefined;
    },
    catchStepClick(stepTitle) {
      if (!this.$route) {
        // storybook context
        this.setCurrentStep(stepTitle);
        return;
      }

      const params = this.$route.params;
      params.substep = stepTitle;

      this.$router.push(
        {
          params,
          query: this.$route.query,
        },
        () => {},
        err => {
          // add empty onAbort to not trigger the NavigationDuplicated Error message
          // when it's a NavigationDuplicated Error
          if (err?.name?.toLowerCase() !== 'navigationduplicated') {
            console.error(err);
          }
        },
      );
    },
    nextStep() {
      const nextIndex = this.currentStepIndex + 1;

      if (nextIndex > this.steps.length - 1) {
        eventBus.emit(EDITMETADATA_NEXT_MAJOR_STEP, this.nextMajorStep);
        return;
      }

      const params = this.$route.params;
      params.substep = this.steps[nextIndex].title;

      this.$router.push({ params });
    },
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
    setupStep() {
      if (this.stepTitle) {
        this.setCurrentStep(this.stepTitle);
      } else {
        const first = this.steps?.length > 0 ? this.steps[0] : null;

        this.setCurrentStep(first?.title);
      }
    },
  },
  watch: {
    stepTitle() {
      // used when navigating from a first detail step to another main step,
      // to step on the initial detail step of the new main step
      this.setupStep();
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
