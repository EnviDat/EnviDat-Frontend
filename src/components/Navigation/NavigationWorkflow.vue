<template>
  <v-card class="pa-4 h-100 navigatorWorkflow" elevation="2" rounded="xl">
    <v-card-title class="text-h6 font-weight-bold mb-4">
      Navigazione Workflow
    </v-card-title>

    <v-card-text>
      <v-list density="comfortable" nav>
        <v-list-item
          v-for="(step, index) in navigationStore.steps"
          :key="index"
          :title="step.title"
          :subtitle="step.description"
        >
          <template #prepend>
            <v-avatar>
              <BaseIcon :icon="mdiCog" :color="'black'" class="mr-1" />
            </v-avatar>
          </template>

          <template #append>
            <v-btn icon="mdi-chevron-right" variant="text">
              <BaseIcon :icon="mdiCog" :color="'black'" class="mr-1" />
            </v-btn>
          </template>
        </v-list-item>
        <v-divider inset></v-divider>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import { mdiCog } from '@mdi/js';

import { useDatasetWorkflowStore } from '@/modules/user/store/datasetWorkflow';

const navigationStore = useDatasetWorkflowStore();
</script>

<style lang="scss">
.navigatorWorkflow {
  background-color: #f8f8f8;
}
</style>
