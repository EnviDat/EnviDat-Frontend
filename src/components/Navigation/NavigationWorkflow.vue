<template>
  <v-card class="pa-0 h-100 navigationWorkflow" elevation="2" rounded="xl">
    <v-card-title class="text-h6 font-weight-bold mb-4 pa-4">
      Navigazione Workflow
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list bg-color="#f8f8f8" class="pa-0" density="comfortable" nav>
        <v-list-item
          v-for="(step, index) in navigationStore.steps"
          :key="index"
          class="pl-4 pr-4 mb-4"
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
            <BaseIcon
              :icon="iconName(step.status)"
              color="blue"
              class="mr-1"
              large="true"
            />
          </template>

          <div
            class="navigationWorkflow__divider"
            v-if="step.id === 3 || step.id === navigationStore.steps.length"
          ></div>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions
      class="d-flex mt-4 navigationWorkflow__actions justify-space-between pl-4 pr-4"
    >
      <div class="navigationWorkflow__actions--item d-flex flex-column">
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
    <v-card-text class="pl-4 pr-4">
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
import { computed } from 'vue';

import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { mdiCog } from '@mdi/js';
import { extractIcons } from '@/factories/iconFactory';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow';

const iconName = (data) => extractIcons(data);

const navigationStore = useDatasetWorkflowStore();
</script>

<style lang="scss">
.navigationWorkflow {
  background-color: #f8f8f8;
  position: relative;
  &__divider {
    background-color: #cac4d0;
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: -10px;
    left: 0;
  }
  &__actions {
    &--item {
      .baseIcon .baseIconFontIcon {
        width: 42px;
        height: 42px;
      }
    }
  }
}
</style>
