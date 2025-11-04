<script setup lang="ts">
/**
 * PreviewTabLayout.vue shows all the resources in a list with preview components.
 *
 * @summary lists the resources with previews
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 14:11:27
 * Last modified  : 2021-08-11 10:14:54
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { defineProps, ref, onMounted, watch } from 'vue';

import ResourceDescription from '@/modules/metadata/components/ResourceDescription.vue';

const props = defineProps<{
  description: string;
  deprecated: boolean;
  isProtected: boolean;
  previewComponent: object;
  resource: object;
}>();

const activeTab = ref('description');

onMounted(() => {
  activeTab.value = props.previewComponent && !props.isProtected ? 'preview' : 'description';
});

watch(
  () => props.previewComponent,
  () => {
    activeTab.value = props.previewComponent && !props.isProtected ? 'preview' : 'description';
  },
);
</script>

<template>
  <v-sheet id="PreviewTabLayout">
    <v-tabs v-model="activeTab" color="black" slider-color="primary" density="compact">
      <v-tab value="description">Description</v-tab>
      <v-tab value="preview">Preview</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-window v-model="activeTab">
      <v-tabs-window-item value="description">
        <ResourceDescription card-color="transparent" :description="props.description" :deprecated="props.depracted" />
      </v-tabs-window-item>
      <v-tabs-window-item value="preview">
        <Suspense v-if="props.previewComponent && !props.isProtected">
          <component :is="props.previewComponent" v-bind="props.resource" />

          <template #fallback>
            <div class="pa-4">Loading Preview...</div>
          </template>
        </Suspense>
        <div v-if="!props.previewComponent && !props.isProtected">
          <div class="pa-4">No Preview available for this kind of resource.</div>
        </div>
        <div v-if="props.previewComponent && props.isProtected">
          <div class="pa-4">No Preview loaded because this resource is Protected.</div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<style scoped></style>
