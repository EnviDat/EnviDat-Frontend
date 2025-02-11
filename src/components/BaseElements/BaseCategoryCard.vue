<template>
  <v-card
    ripple
    hover
    raised
    :height="height"
    :disabled="disabled"
    @click="clicked"
    class="d-flex align-center pa-2 rounded-xl bgcCard"
    :style="{
      backgroundColor: getBgcColor,
      border: isMode ? `2px solid ${convertToRgba(color, 0.9)}` : '',
    }"
  >
    <v-container class="pa-0">
      <v-row align="center" no-gutters>
        <v-col cols="12">
          <v-card
            flat
            class="d-flex align-center px-2 px-sm-3 baseClickCardTitle font-weight-bold"
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
            <v-img v-if="img" :width="iconSize" :src="img" class="mr-1"></v-img>
            <span>{{ title }}</span>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
    default: '',
  },
  isMode: {
    type: Boolean,
    default: false,
  },
  contain: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  compact: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '40',
  },
  iconSize: {
    type: String,
    default: '20',
  },
});

const emit = defineEmits(['click']);

const clicked = () => {
  emit('click', props.title.toLowerCase());
};

const convertToRgba = (color, alpha = 1) => {
  let r;
  let g;
  let b;

  if (/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/.test(color)) {
    const rgbValues = color.match(/\d+/g).map(Number);
    r = rgbValues[0];
    g = rgbValues[1];
    b = rgbValues[2];
  } else if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
    let hex = color.substring(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((x) => x + x)
        .join('');
    }
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    return color;
  }

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const darkenHex = (hex, percent) => {
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

  const newHex = `#${[clampedR, clampedG, clampedB]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`;

  return newHex;
};

// computed

const getBgcColor = computed(() => {
  let bgc = '#fff';
  if (props.isMode) {
    bgc = '#fff';
  }
  if (props.color && !props.isMode) {
    bgc = convertToRgba(props.color, 0.9);
  }
  return bgc;
});
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

@media screen and (max-width: 1920px) {
  .compactTitle {
    font-size: 1rem !important;
    line-height: 1.3em !important;
  }
}

@media screen and (min-width: 1921px) {
  .compactTitle {
    font-size: 1.1rem !important;
    line-height: 1.1em !important;
  }
}

.v-card__media img {
  width: inherit !important;
}

.rounded-xl {
  border-radius: 1rem;
}
</style>
