<template>
  <div id="StepperHeader">

    <div class="stepperHeaderRow" >

        <div v-for="(step, index) in stepsWithGaps"
             :key="`step-${index}`"
              :style="`flex-grow: ${step ? 0 : 2}; `"
             class="py-1 py-md-0"
        >

            <v-divider v-if="!step && $vuetify.display.smAndUp"
                       color="accent"
                       class="mx-2 mx-md-5"
                       style="align-self: center; "
            />


            <StepButton v-if="step"
                        :id="`step-${index}`"
                        :title="$vuetify.display.smAndUp ? step.title : ''"
                        :active="isCurrentStep(step)"
                        :complete="step.completed"
                        :number="step.number"
                        :error="step.error"
                        :showNumberOnly="$vuetify.display.smAndDown"
                        @stepClick="catchStepClick(step.title)"
            />

        </div>
    </div>


  </div>
</template>

<script>
/**
 * @summary Stepper for structuring a workflow
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-29 13:51:43
 * Last modified  : 2021-07-28 07:54:13
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import StepButton from '@/components/Navigation/StepButton.vue';

export default {
  name: 'StepperHeader',
  props: {
    steps: Array,
    currentStepIndex: Number,
    activeColor: {
      type: String,
      default: 'primary',
    },
    inactiveColor: {
      type: String,
      default: 'grey',
    },
    stepColor: {
      type: String,
      default: 'white',
    },
  },
  computed: {
    stepsWithGaps() {
      const stepsAndGaps = [];
      const amount = this.steps.length;
      const gaps = (this.steps.length - 1)
      let stepCount = 0;

      for (let i = 0; i < amount + gaps; i++) {
        let step = null;

        if ((i + 1) % 2 !== 0) {
          step = {
            ... this.steps[stepCount],
            number: (stepCount + 1),
          };
          stepCount++;
        }

        stepsAndGaps.push(step);
      }

      return stepsAndGaps;
    },
    currentStep() {
      return this.steps[this.currentStepIndex] || null;
    },
  },
  methods: {
    isCurrentStep(step) {

      const currentS = this.currentStep;
      if (currentS) {
        return currentS.title === step.title;
      }

      return false;
    },
    catchStepClick(title) {
      this.$emit('stepClick', title);
    },
  },
  components: {
    StepButton,
  },
};
</script>

<style scoped>

  .stepperHeaderRow {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }

  .blackTextStepIcon > .v-stepper__step__step > .v-icon {
    color: black !important;
  }
</style>
