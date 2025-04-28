<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-col cols="3" class="workflow-navigation__wrapper">
        <NavigationWorkflow />
      </v-col>

      <v-col
        cols="9"
        class="workflow-content__wrapper"
        :class="{ loading: navigationStore.loading }"
      >
        <div>
          Content {{ navigationStore.loading }}
          {{ navigationStore.currentStep }}
        </div>
        {{ navigationStore.steps }}
        <v-btn @click="nextStep">Save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import NavigationWorkflow from '@/components/Navigation/NavigationWorkflow.vue';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow';

const navigationStore = useDatasetWorkflowStore();

const nextStep = () => {
  navigationStore.validateStep(navigationStore.currentStep);
};
</script>

<style lang="scss">
.loading {
  opacity: 0.2;
}
</style>
