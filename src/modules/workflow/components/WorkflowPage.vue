<template>
  <v-container class="fill-height" fluid>
    <v-row
      class="fill-height"
      :class="{ 'overflow-x-scroll': display.smAndDown.value }"
    >
      <v-col cols="12" md="4" xl="3" class="workflow-navigation__wrapper">
        <NavigationWorkflow />
      </v-col>

      <v-col
        cols="12"
        md="8"
        xl="9"
        class="workflow-content__wrapper"
        :class="{ loading: navigationStore.loading }"
      >
        <div>
          <component
            :is="currentAsyncComponent"
            v-bind="vm"
            @validate="validate"
            @save="save"
            v-if="currentAsyncComponent"
          />
        </div>
        <div class="pa-4 d-flex align-center justify-end">
          <v-btn @click="nextStep">Save</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useDisplay } from 'vuetify';
import { storeToRefs } from 'pinia';

import { ref, watch } from 'vue';

import NavigationWorkflow from '@/components/Navigation/NavigationWorkflow.vue';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow';

// define useDisplay
const display = useDisplay();

const navigationStore = useDatasetWorkflowStore();

const vm = ref(null);

// load the current view model
watch(
  () => navigationStore.currentStep,
  async () => {
    vm.value = navigationStore.currentViewModel;
    console.log(vm.value);
  },
  { immediate: true },
);

const save = (data) => {
  vm.value.save(data);
}

const validate = (data) => {
  vm.value?.validate(data);
};

const { currentStepObject, currentAsyncComponent } =
  storeToRefs(navigationStore);

const nextStep = () => {
  navigationStore.validateStepAction(
    navigationStore.currentStep,
  );
};
</script>

<style lang="scss">
.loading {
  opacity: 0.2;
}
</style>
