<template>
  <v-card class="pa-4">
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ title }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-h6">{{ subtitle }}</div>
        </v-col>
      </v-row>

      <v-row no-gutters align="center" class="pt-6">
        <v-col class="flex-grow-0 pr-2">
          <v-icon :icon="mdiPen" size="x-large" />
        </v-col>

        <v-col class="text-body-1" v-html="instructions"> </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mdiPen } from '@mdi/js';

export default {
  name: 'CreateDataAndResources',
  data: () => ({
    mdiPen,
    title: 'Research Data & Resources',
    subtitle: 'This dataset is still a "Draft"',
    instructions:
      "Please finish all the steps to create your datasets on the server. Once it's saved you can upload your research data and other resources in the editing workflow.",
  }),
};
</script>

<style scoped></style>
