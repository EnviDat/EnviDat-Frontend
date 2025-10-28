<template>
  <v-card
    id="BaseCategory"
    flat
    class="d-flex align-center px-1 baseClickCardTitle font-weight-bold"
    :style="{
      backgroundColor: 'transparent',
      color: color ? darkenHex(color, 80) : '#000',
    }"
  >
    <v-icon
      v-if="icon"
      :size="iconSize"
      class="mr-1"
      :color="color ? darkenHex(color, 50) : '#000'"
    >
      {{ icon }}
    </v-icon>
    <v-img v-if="img" :width="iconSize" :src="imageResolved" class="mr-1" />

    <span>{{ title }}</span>
  </v-card>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { getImage } from '@/factories/imageFactory.js';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: undefined,
  },
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  iconSize: {
    type: String,
    default: '20',
  },
});

const imageResolved = ref();

onMounted(async () => {
  if (props.img) {
    imageResolved.value = await getImage(props.img);
  }
});

function darkenHex(hex, percent) {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return hex;
  }
  let hexValue = hex.substring(1);
  if (hexValue.length === 3) {
    hexValue = hexValue
      .split('')
      .map((x) => x + x)
      .join('');
  }
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);

  const factor = 1 - Math.max(0, Math.min(100, percent)) / 100;

  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);

  const clampedR = Math.min(255, Math.max(0, newR));
  const clampedG = Math.min(255, Math.max(0, newG));
  const clampedB = Math.min(255, Math.max(0, newB));

  return `#${[clampedR, clampedG, clampedB]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`;
}
</script>

<style scoped>
.baseClickCardTitle {
  font-size: 1rem !important;
  overflow: inherit !important;
  text-overflow: inherit !important;
  max-height: inherit !important;
  line-height: 1.1em !important;
  text-align: center;
}
</style>
