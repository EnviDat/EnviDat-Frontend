<template>
  <v-card id="PdfPreviewCard" class="fill-height" flat>
    <v-card-text ref="containerRef" class="embed-container">
      <embed type="application/pdf" :src="url" :width="size.width" :height="size.height" />
    </v-card-text>
  </v-card>
</template>

<script setup>
/**
 * PdfPreviewCard.vue a card which previews a text resource
 *
 * @summary embeds a pdf for the browser to show natively
 * @author Dominik Haas-Artho
 *
 * Created at     : 2015-11-06 140:11:27
 * Last modified  : 2015-11-06 140:11:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { ref, onMounted } from 'vue';

const props = defineProps({
  url: String,
});

const containerRef = ref(null);
const size = ref({ width: 450, height: 400 });

onMounted(() => {
  if (!containerRef.value) return;

  // Initialize with current size
  const htmlElement = containerRef.value.$el;
  size.value = {
    width: htmlElement.clientWidth,
    height: htmlElement.clientHeight,
  };

  // Watch for dynamic resizing
  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      size.value = { width, height };
    }
  });
  observer.observe(htmlElement);

  // onBeforeUnmount(() => observer.disconnect());
});
</script>

<style scoped>
.embed-container {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
}
embed {
  display: block;
  border: none;
}
</style>
