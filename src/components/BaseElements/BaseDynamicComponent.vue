<template>
  <Suspense>

    <template #default>
      <component :is="component" v-bind="component.props || {}" />
    </template>

    <template #fallback>
      <v-skeleton-loader v-if="showLoader" :type="skeletonType"></v-skeleton-loader>
    </template>

  </Suspense>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
  componentProps: {
    type: Object,
    required: false,
  },
  skeletonType: {
    type: String,
    default: 'card',
  },
  showLoader: {
    type: Boolean,
    default: false,
  },
});

</script>
