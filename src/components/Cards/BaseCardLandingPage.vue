<template>
  <v-card ripple @mouseover="hover = true" @mouseleave="hover = false" class="fill-height elevation-5 rounded-xl">
    <v-container class="fill-height category-card">
      <v-card class="pa-3 fill-height elevation-0 rounded-xl d-flex flex-column bgcCard">
        <!-- Category above if active -->
        <v-row v-if="categoryAbove">
          <v-col cols="auto">
            <BaseCategoryCard
              class="mb-4"
              :elevation="0"
              :color="categoryColor"
              :disableClick="true"
              height="45"
              :blackText="isBlackText"
              :title="getCategoryName"
              :icon="computedIcon"
            />
          </v-col>
        </v-row>

        <!-- Title -->
        <v-row class="category-title" no-gutters>
          <v-col class="pa-0" cols="12">
            <span class="text-h6 font-weight-bold">{{ truncatedTitle }}</span>
          </v-col>
        </v-row>

        <!-- Category below if active -->
        <v-row v-if="categoryBelow">
          <v-col cols="auto">
            <BaseCategoryCard
              :elevation="0"
              :color="categoryColor"
              :disableClick="true"
              height="25"
              :blackText="isBlackText"
              :title="getCategoryName"
              :icon="computedIcon"
            />
          </v-col>
        </v-row>

        <!-- Subtitle / Text -->
        <v-row class="category-subtitle pt-3" no-gutters v-if="hasSubtitle">
          <v-col class="pa-0">
            <div v-html="!truncateSubTilte ? subtitle : truncatedSubtitle"></div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Action section: date and button -->
      <v-row class="category-action">
        <v-col class="d-flex justify-space-between pa-6">
          <span class="text-body-1">{{ formattedDate }}</span>
          <v-btn v-if="showButton" color="secondary" @click="cardClick">
            {{ buttonText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';
import { extractIcons } from '@/factories/iconFactory';
import { formatDate } from '@/factories/dateFactory';
import { stripMarkdown } from '@/factories/stringFactory';

const props = defineProps({
  id: String,
  title: String,
  subtitle: {
    type: String,
    default: '',
  },
  date: String,
  categoryName: {
    type: String,
    default: 'Category',
  },
  categoryColor: {
    type: String,
    default: '#35A89D',
  },
  // Flag to position the category above or below
  categoryAbove: {
    type: Boolean,
    default: false,
  },
  categoryBelow: {
    type: Boolean,
    default: false,
  },
  truncateSubTilte: {
    type: Boolean,
    default: false,
  },
  // Flag to show the button
  showButton: {
    type: Boolean,
    default: true,
  },
  // Specifies the card type: 'metadata', 'team', 'blog'
  cardType: {
    type: String,
    default: 'metadata',
  },
  // Button text (e.g., "View" or "Read")
  buttonText: {
    type: String,
    default: 'View',
  },
});

const emit = defineEmits(['clickedEvent']);

const hover = ref(false);
const titleLength = ref(50);
const descriptionLength = ref(200);

const truncatedTitle = computed(() => {
  if (props.title && props.title.length > titleLength.value) {
    // Using template literal instead of string concatenation
    return `${props.title.substring(0, titleLength.value)}...`;
  }
  return props.title;
});

const truncatedSubtitle = computed(() => {
  const cleanSubtitle = stripMarkdown(props.subtitle, true);
  if (cleanSubtitle && cleanSubtitle.length > descriptionLength.value) {
    // Using template literal instead of string concatenation
    return `${cleanSubtitle.substring(0, descriptionLength.value)}...`;
  }
  return cleanSubtitle;
});

const formattedDate = computed(() => (props.date ? formatDate(props.date, 'yyyy-MM-dd', true) : ''));

const getCategoryName = computed(() =>
  props.categoryName
    .split(' ')
    .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
    .join(' '),
);

const computedIcon = computed(() => {
  if (props.cardType === 'team') {
    return extractIcons('team');
  }
  if (props.cardType === 'blog') {
    return extractIcons('post');
  }
  return extractIcons(getCategoryName.value);
});

const isBlackText = computed(() => props.cardType !== 'metadata');

const hasSubtitle = computed(() => !!props.subtitle);

function cardClick() {
  emit('clickedEvent', props.id);
}
</script>

<style scoped>
.category-card {
  display: grid;
  grid-template-rows: minmax(200px, auto) 20px;
}
.category-title {
  grid-row-start: 1;
}
.category-subtitle {
  grid-row-start: 2;
}
.category-action {
  grid-row-start: 3;
}
</style>
