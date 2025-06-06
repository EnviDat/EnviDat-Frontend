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
        <!-- {{ vm?.loading }} -->
        <!-- {{ vm?.error }} -->
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
    <!-- dialog, TODO make a external component -->
    <v-dialog v-model="navigationStore.openSaveDialog" max-width="500">
      <v-card>
        <v-card-text class="font-weight-bold"> Before You Proceed </v-card-text>

        <v-card-text>
          Saving your data now will <b>store your dataset in our system</b>, but
          it will not be published yet. Before publication, you will need to
          complete the remaining steps. However, from this point,
          <b>you can request a DOI for your dataset.</b>
        </v-card-text>

        <v-card-text>
          For any questions or clarifications, please contact the team at
          <a href="mailto:envidat@wsl.ch">envidat@wsl.ch</a>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Save and Proceed"
            @click="navigationStore.confirmSave(obj)"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
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

// DOMINIK - only for validate all object, for now or the future implementation
// DOMINIK - WE NEED obj because we need to pass it to validateStepAction, for the obj validation
const obj = ref(null);

// load the current view model
watch(
  () => navigationStore.currentStep,
  async () => {
    vm.value = navigationStore.currentViewModel;
  },
  { immediate: true },
);

const save = (data) => {
  obj.value = data;
  vm.value.save(data);
};

const validate = (data) => {
  obj.value = data;
  vm.value?.validate(data);
};

const { currentStepObject, currentAsyncComponent } =
  storeToRefs(navigationStore);

const nextStep = () => {
  navigationStore.validateStepAction(navigationStore.currentStep, obj.value);
};
</script>

<style lang="scss">
.loading {
  opacity: 0.2;
}
</style>
