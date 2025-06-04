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
            v-if="currentAsyncComponent && vm"
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

import { defineAsyncComponent, computed, ref, watch } from 'vue';

import NavigationWorkflow from '@/components/Navigation/NavigationWorkflow.vue';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow';

// define useDisplay
const display = useDisplay();

const navigationStore = useDatasetWorkflowStore();

const dataModel = ref(null);

const vm = ref(null);

// load the current view model
watch(
  () => navigationStore.currentStep,
  async () => {
    vm.value = await navigationStore.currentViewModel;
    console.log(vm.value);
  },
  { immediate: true },
);

// save the data and pass them to the save function
const setDataModel = (data) => {
  dataModel.value = data;
};

const validate = (data) => {
  setDataModel(data);
  // we need to validate the sigle field, otherwise everytime the entire object would be triggered
  // vm.value?.validate(data);
  vm.value?.validateSingleField(data);
};

const { currentStepObject, currentAsyncComponent } =
  storeToRefs(navigationStore);

const nextStep = () => {
  navigationStore.validateStepAction(
    navigationStore.currentStep,
    dataModel.value,
  );
};
</script>

<style lang="scss">
.loading {
  opacity: 0.2;
}
</style>
