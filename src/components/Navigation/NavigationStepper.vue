<template>
  <v-container id="NavigationStepper">


    <v-row no-gutters
            :style="`background-color: ${$vuetify ? $vuetify.theme.themes.light.primary : ''}`" >
      <v-col cols="12">
        <Stepper :steps="mySteps"
                  activeColor="accent"
                  @stepClick="catchStepClick" />
      </v-col>
    </v-row>
    <v-row no-gutters >
      <v-col cols="12" 
              :style="`background-color: ${$vuetify ? $vuetify.theme.themes.light.primary : ''}`">

        <v-card style="background-color: white;"
                :height="500"
                class="ma-1">
          {{ currentStep.title }}
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
/**

 * @summary NavigationStepper for structuring a workflow
 * @author Rebecca Kurup Buchholz
 *
 * Created at     : 2021-06-29 13:51:43
 * Last modified  : 2021-06-29 18:00:53

 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import Stepper from '@/components/Navigation/Stepper';

export default {
  name: 'NavigationStepper',
  props: {
    steps: Array,
  },
  beforeMount() {
    this.mySteps = this.steps;
    this.currentStep = this.mySteps[0];
    this.currentStep.active = true;
  },
  computed: {
  },
  methods: {
    catchStepClick(step) {
      // alert(`clicked ${step}`);

      for (let i = 0; i < this.mySteps.length; i++) {
        const s = this.mySteps[i];
        s.active = s.title === step;
        if (s.active) {
          this.currentStep = s;
        }
      }
    },
  },
  data: () => ({
    currentStep: null,
    mySteps: [],
  }),
  components: {
    Stepper,
  },  
};
</script>

<style scoped>


</style>
