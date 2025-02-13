<template>
  <v-card
    ripple
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="fill-height elevation-5 rounded-xl"
  >
    <v-container class="fill-height category-card">
      <!-- Nested card per raggruppare i contenuti interni -->
      <v-card
        class="pa-3 fill-height elevation-0 rounded-xl d-flex flex-column bgcCard"
      >
        <!-- Categoria sopra il titolo (visibile se categoryAbove è true) -->
        <v-row v-if="categoryAbove">
          <v-col cols="auto">
            <BaseCategoryCard
              class="mb-4"
              :elevation="0"
              :color="categoryColor"
              :blackText="true"
              :disableClick="true"
              :height="45"
              :title="getCategoryName"
              :icon="iconName('team')"
            />
          </v-col>
        </v-row>
        <!-- Titolo -->
        <v-row class="category-title" no-gutters>
          <v-col class="pa-0" cols="12">
            <span class="text-h6 font-weight-bold">{{ truncatedTitle }}</span>
          </v-col>
        </v-row>
        <!-- Sottotitolo -->
        <v-row class="category-subtitle pt-3" no-gutters>
          <v-col class="pa-0">
            <div v-html="postText"></div>
          </v-col>
        </v-row>
      </v-card>
      <!-- Area azione -->
      <v-row class="category-action">
        <v-col class="d-flex justify-space-between pa-6">
          <span class="text-body-1">{{ formattedDate }}</span>
          <v-btn v-if="showButton" color="secondary" @click="cardClick">
            View
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { stripMarkdown } from '@/factories/stringFactory';
import { extractIcons } from '@/factories/iconFactory';
import { formatDate } from '@/factories/dateFactory';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';

// Definizione delle props
const props = defineProps({
  id: String,
  postTitle: String,
  postText: {
    type: String,
    default: '',
  },
  postDate: String,
  showButton: {
    type: Boolean,
    default: false,
  },
  // Props per la gestione della categoria
  categoryColor: {
    type: String,
    default: '#aab2ff',
  },
  categoryName: {
    type: String,
    default: 'Envidat Team',
  },
  categoryAbove: {
    type: Boolean,
    default: true,
  },
  categoryBelow: {
    type: Boolean,
    default: false,
  },
});

// Definizione degli eventi
const emit = defineEmits(['clickedEvent']);

// Stato locale
const hover = ref(false);
const titleLength = ref(50);
const textLength = ref(200);

// Computed property per formattare il nome della categoria
const getCategoryName = computed(() =>
  props.categoryName
    .split(' ')
    .map((word) =>
      word.length === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' '),
);

// Computed property per il titolo troncato
const truncatedTitle = computed(() => {
  const maxLength = titleLength.value;
  if (props.postTitle && props.postTitle.length > maxLength) {
    return `${props.postTitle.substring(0, maxLength)}...`;
  }
  return props.postTitle;
});

// Computed property per il sottotitolo troncato (utilizzando stripMarkdown)
const truncatedSubtitle = computed(() => {
  const maxLength = textLength.value;
  const cleanText = stripMarkdown(props.postText, true);
  if (cleanText && cleanText.length > maxLength) {
    return `${cleanText.substring(0, maxLength)}...`;
  }
  return cleanText;
});

// Computed property per la data formattata
const formattedDate = computed(() =>
  props.postDate ? formatDate(props.postDate, 'yyyy-MM-dd', true) : '',
);

// Funzione per ottenere l'icona corrispondente
const iconName = (data) => extractIcons(data);

// Funzione per la gestione del click
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
