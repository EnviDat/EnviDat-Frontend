<template>
  <v-card
    class="pa-0 pt-8 pb-8 h-100 flex-column navigationWorkflow"
    elevation="2"
    rounded="xl"
  >
    <v-card-title class="text-h6 font-weight-bold mb-4 pa-4">
      Create your Dataset
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list bg-color="#f8f8f8" class="pa-0" density="comfortable" nav>
        <v-list-item
          v-for="(step, index) in navigationStore.steps"
          :key="index"
          :class="[
            'navigationWorkflow__item',
            // step.status can be active, completed, error
            step.status,

            // step.id === navigationStore.currentStep ? 'active' : '',
            // step.completed === true ? 'completed' : '',
            // step.hasError === true ? 'error' : '',
            // step.completed === false && step.id != navigationStore.currentStep
            //   ? 'disabled'
            //   : '',
          ]"
          @click="navigateItem(step.id, step.status)"
          class="pl-4 pr-4 mb-6 navigationWorkflow__item"
        >
          <template #prepend>
            <BaseIcon :icon="iconName(step.icon)" color="black" class="mr-4" />
          </template>

          <template #title>
            <span class="text-subtitle-1">{{ step.title }}</span>
          </template>

          <template #subtitle>
            <span class="text-body-2">{{ step.description }}</span>
          </template>

          <template #append>
            <div
              class="navigationWorkflow__append mr-1"
              :class="[
                step.status,
                // active: step.id === navigationStore.currentStep,
                // completed: step.completed,
                // error: step.hasError,
              ]"
            >
              <BaseIcon
                v-if="step.completed"
                :icon="iconName('success')"
                class="navigationWorkflow__append--number"
                :color="'#fff'"
              />
              <span v-else class="navigationWorkflow__append--number">{{
                step.id + 1
              }}</span>
            </div>
          </template>

          <div
            class="navigationWorkflow__divider"
            v-if="step.id === 3 || step.id === navigationStore.steps.length - 1"
          ></div>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions
      class="d-flex mt-4 navigationWorkflow__actions justify-space-between pl-4 pr-4"
    >
      <div
        @click="initDriver"
        class="navigationWorkflow__actions--item d-flex flex-column"
      >
        <BaseIcon :icon="iconName('question')" :color="'black'" />
        <span class="text-body-2 mt-2">Help mode</span>
      </div>
      <div class="navigationWorkflow__actions--item d-flex flex-column">
        <BaseIcon :icon="iconName('print')" :color="'black'" />
        <span class="text-body-2 mt-2">Reserve DOI</span>
      </div>
      <div class="navigationWorkflow__actions--item d-flex flex-column">
        <BaseIcon :icon="iconName('draft')" :color="'black'" />
        <span class="text-body-2 mt-2">Draft</span>
      </div>
    </v-card-actions>
    <v-card-text class="pl-4 pr-4 navigationWorkflow__note">
      <span class="font-weight-bold d-block mb-2">Note:</span>
      <span class="text-sm text-gray-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Excepteur sint occaecat cupidatat non
        proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
    </v-card-text>
  </v-card>
</template>

<script setup>
// import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { extractIcons } from '@/factories/iconFactory';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow';

// Extract Icon name from IconFactory
const iconName = (data) => extractIcons(data);

const navigationStore = useDatasetWorkflowStore();

// getters from pinia -> navigationStore
const { currentStepObject } = storeToRefs(navigationStore);

const navigateItem = (id, status) => {
  navigationStore.navigateItemAction(id, status);
};

// init the driver step
const initDriver = () => {
  // DEFINE the guidelines on the store for each step
  driver({
    showProgress: true,
    steps: navigationStore.currentStepObject?.guideLines ?? [],
  }).drive();
};
</script>

<style lang="scss">
.navigationWorkflow {
  background-color: #f8f8f8;
  height: 100%;
  position: relative;
  &__divider {
    background-color: #cac4d0;
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: -12px;
    left: 0;
  }
  &__actions {
    &--item {
      align-items: center;
      .baseIcon .baseIconFontIcon {
        width: 42px;
        height: 42px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
  &__item {
    &:hover {
      // background-color: #eaeaea;
      cursor: pointer;
    }
    &.disabled {
      opacity: 0.5;
      &:hover {
        // background-color: #eaeaea;
        cursor: not-allowed;
      }
    }
    // &.active {
    //   background-color: #eaeaea;
    // }
  }
  &__append {
    height: 30px;
    width: 30px;
    background-color: #fff;
    border-radius: 50%;
    position: relative;
    &--number {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #000;
      font-size: 14px;
    }
    &.active {
      background-color: #499df7;
      .navigationWorkflow__append--number {
        color: #fff;
        font-weight: bold;
      }
    }
    &.completed {
      background-color: #40c057;
      .navigationWorkflow__append--number {
        color: #fff;
      }
    }
    &.error {
      background-color: #e38c2f;
      .navigationWorkflow__append--number {
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
</style>
