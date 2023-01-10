<template>
  <div id="StepperHeader">
<!--
    <v-stepper
      v-model="currentStep"
      :value="stepNumber"
      :height="height"
      style="background: transparent; box-shadow: unset !important;"
    >
      <v-stepper-header :style="`height: ${height}px; `">
        <template v-for="(step, index) in steps">
          <v-stepper-step
            :key="`step-${index}`"
            :id="`step-${index}`"
            :color="getStepIconColor(step, index)"
            editable
            edit-icon="check"
            error-icon="error"
            :complete="step.completed"
            :step="index + 1"
            :rules="[() => !step.error]"
            class="py-0 px-3 my-0 mx-2 blackTextStepIcon"
            style="border-radius: 4px;"
            :style="
              `background-color: ${getStepBackgroundColor(step)};
                                   border: solid black ${
                                     stepColor === 'white' ? 1 : 0
                                   }px;`
            "
            @click="catchStepClick(step)"
          >
            &lt;!&ndash;            <v-container fluid class="pa-0">
            <v-row no-gutters>
              <v-col class=""
                      :cols="step.error ? 4 : undefined">
                {{ step.title }}
              </v-col>
              <v-col v-if="step.error"
                     class="">
                <small>{{ step.error }}</small>
              </v-col>
            </v-row>
            </v-container>&ndash;&gt;
            {{ step.title }}
            <div v-if="step.error">
              <small>{{ step.error }}</small>
            </div>
          </v-stepper-step>

          <v-divider
            v-if="index !== steps.length - 1"
            :key="index"
            color="accent"
            class="mx-3"
          />
        </template>
      </v-stepper-header>
    </v-stepper>
-->
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
    stepNumber: Number,
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
    height: {
      type: Number,
      default: 40,
    },
  },
  created() {
    // +1 so that the steps icons are beginning with 1 not 0
    this.currentStep = this.stepNumber + 1;
  },
  watch: {
    stepNumber() {
      this.currentStep = this.stepNumber + 1;
    },
  },
  computed: {},
  methods: {
    catchStepClick(step) {
      this.$emit('stepClick', step.title);
    },
    getStepIconColor(step, index) {
      if (this.currentStep === index + 1) {
        return this.activeColor;
      }

      if (step.completed) {
        return this.$vuetify.theme.themes.light.success;
      }

      if (step.error) {
        return 'white';
      }

      return this.inactiveColor;
    },
    getStepBackgroundColor(step) {
      if (step.error) {
        return 'white';
      }

      return this.$vuetify.theme.themes.light[this.stepColor];
    },
  },
  data: () => ({
    currentStep: -1,
  }),
  components: {},
};
</script>

<style scoped>
.blackTextStepIcon > .v-stepper__step__step > .v-icon {
  color: black !important;
}
</style>
