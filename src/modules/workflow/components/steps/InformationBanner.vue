<template>
  <v-col class="ma-0 pt-0 pb-0 justify-end d-flex">
    <v-chip v-if="!show" class="info-banner" color="#92e5ef" :append-icon="icon" @click="openInfoBanner">
      Open Info
    </v-chip>
    <v-alert
      v-if="show"
      :type="type"
      :icon="false"
      closable
      class="rounded-lg info-banner"
      @click:close="closeInfoBanner"
    >
      <v-alert-title v-if="title" class="mb-2">{{ title }}</v-alert-title>
      <slot />
    </v-alert>
  </v-col>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, onMounted } from 'vue';

withDefaults(
  defineProps<{
    show: boolean;
    icon?: string;
    title?: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    storageKey?: string;
  }>(),
  { title: 'Information', type: 'info', storageKey: 'metadataBaseInfoBannerShow' },
);

const emit = defineEmits<{ (e: 'setInfoBanner', value: boolean): void }>();

function openInfoBanner() {
  emit('setInfoBanner', true);
  try {
    window.localStorage.setItem('metadataBaseInfoBannerShow', 'True');
  } catch {
    console.log('Could not access localStorage');
  }
}
function closeInfoBanner() {
  emit('setInfoBanner', false);
  try {
    window.localStorage.setItem('metadataBaseInfoBannerShow', 'False');
  } catch {
    console.log('Could not access localStorage');
  }
}
onMounted(() => {
  const ls = localStorage.getItem('metadataBaseInfoBannerShow');
  if (ls === null) {
    emit('setInfoBanner', true);
    return;
  }

  return ls === 'True' ? emit('setInfoBanner', true) : emit('setInfoBanner', false);
});
</script>
