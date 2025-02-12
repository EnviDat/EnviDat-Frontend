<template>
  <v-card
    ripple
    hover
    raised
    :height="height"
    :disabled="disabled"
    @click="clicked"
    :elevation="elevation"
    class="d-flex align-center pa-2 rounded-xl bgcCard"
    :style="{
      backgroundColor: getBgcColor,
      border: isMode ? `2px solid ${convertToRgba(color, 0.9)}` : '',
      maxWidth: maxWidth,
    }"
  >
    <v-container class="pa-0">
      <v-row align="center" no-gutters>
        <v-col cols="12">
          <BaseCategory
            :title="title"
            :icon="icon"
            :color="!blackText && color ? color : '#000'"
            :iconSize="iconSize"
            :img="img"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import BaseCategory from '@/components/BaseElements/BaseCategory.vue';

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
  blackText: {
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
  elevation: {
    type: Number,
    default: 5,
  },
  maxWidth: {
    type: String,
    default: 'auto',
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
