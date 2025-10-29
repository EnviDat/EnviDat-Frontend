<script setup lang="ts">
/**
 * S3PreviewCard.vue a card which shows a preview of an S3 bucket
 *
 * @summary renders an image
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { computed, ref, defineProps } from 'vue';
import { useTheme } from 'vuetify';
import S3Tree from '@/modules/s3/components/S3Tree.vue';

const theme = useTheme();

const props = defineProps<{
  url: string;
}>();

const loading = ref(false);

const loadingColor = computed(() => {
  if (loading.value) {
    return 'accent';
  }

  return undefined;
});
</script>

<template>
  <v-card
    flat
    class="pa-4 text-black"
    :loading="loadingColor"
    color="white"
    :style="`border: 1px solid ${theme?.themes.value?.light?.colors?.highlight}`"
  >
    <S3Tree :url="props.url" @loadingChanged="(load) => (loading = load)" />
  </v-card>
</template>

<style scoped>
.imagePreviewErrorContainer {
  display: grid;
}

#backdrop,
#curtain {
  grid-area: 1/1;
}

.customIcon {
  opacity: 0.5;
}
</style>
