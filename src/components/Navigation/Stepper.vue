<template>
  <div id="Stepper">

    <v-stepper non-linear
                v-model="currentStep"
                style="background: transparent; box-shadow: unset !important;" >
                
                <!-- :style="`background-color: ${$vuetify ? $vuetify.theme.themes.light.primary : ''}`" > -->
      <v-stepper-header>

        <template v-for="(step, index) in steps">

          <v-stepper-step :key="`${index}-step`"
                          :color="step.active ? activeColor : inactiveColor"
                          editable
                          :complete="step.completed"
                          complete-icon="check_circle"
                          :edit-icon="step.completed ? 'check' : 'edit'"
                          :step="index + 1"
                          @click="catchStepClick(step.title)" 
                          :class="step.active ? 'blackTextStepIcon' : ''"
                          :style="`background-color: ${step.color};`"
                        >
            {{ step.title }}
          </v-stepper-step>

          <v-divider v-if="index !== (steps.length - 1)"
                      :key="index"
                      class="mx-3" />
        </template>
      </v-stepper-header>
    </v-stepper>

  </div>
</template>

<script>
/**

 * @summary Stepper for structuring a workflow
 * @author Rebecca Kurup Buchholz
 *
 * Created at     : 2021-06-29 13:51:43
 * Last modified  : 2021-06-29 18:02:00

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/


export default {
  name: 'Stepper',
  props: {
    steps: Array,
    activeColor: {
      type: String,
      default: 'primary',
    },
    inactiveColor: {
      type: String,
      default: 'highlight',
    },    
  },
  computed: {
  },
  methods: {
    catchStepClick(step) {
      this.$emit('stepClick', step);
    },
  },
  data: () => ({
    currentStep: 0,
  }),
  components: {
  },  
};
</script>

<style scoped>
  /* .blackTextStepIcon > span.v-stepper__step__step.accent {
    color: black !important;
  } */

</style>
