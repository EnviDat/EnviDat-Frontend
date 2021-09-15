<template>
  <div id="StepperHeader">

    <v-stepper v-model="currentStep"
                :value="initialStep"
                style="background: transparent; box-shadow: unset !important;" >

                <!-- :style="`background-color: ${$vuetify ? $vuetify.theme.themes.light.primary : ''}`" > -->
      <v-stepper-header>

        <template v-for="(step, index) in steps">

          <v-stepper-step :key="`step-${index}`"
                          :id="`step-${index}`"
                          :color="currentStep === (index + 1) ? activeColor : inactiveColor"
                          editable
                          :complete="step.completed"
                          complete-icon="check_circle"
                          :step="(index + 1)"
                          @click="catchStepClick(step)"
                          class="py-0 px-3 ma-4 blackTextStepIcon"
                          style="border-radius: 4px;"
                          :style="`background-color: ${$vuetify ? $vuetify.theme.themes.light[stepColor] : ''};`"
                          >
            {{ step.title }}
          </v-stepper-step>

          <v-divider v-if="index !== (steps.length - 1)"
                      :key="index"
                      color="accent"
                      class="mx-3" />
        </template>
      </v-stepper-header>
    </v-stepper>

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

export default {
  name: 'StepperHeader',
  props: {
    steps: Array,
    initialStep: Number,
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
  created() {
    // +1 so that the steps icons are beginning with 1 not 0
    this.currentStep = this.initialStep + 1;
  },
  watch: {
    initialStep() {
      this.currentStep = this.initialStep + 1;
    },
  },
  methods: {
    catchStepClick(step) {
      this.$emit('stepClick', step.title);
    },
  },
  data: () => ({
    currentStep: -1,
  }),
  components: {
  },
};
</script>

<style scoped>
  .blackTextStepIcon > .v-stepper__step__step > .v-icon {
    color: black !important;
  }

</style>
