<template>
  <v-card
    ripple
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="fill-height pa-4 elevation-5 rounded-xl"
    :dark="false"
  >
    <v-container class="ma-2 fill-height category-card">
      <v-row>
        <v-col class="pb-0" cols="auto">
          <BaseCategoryCard
            :elevation="0"
            color="#aab2ff"
            :blackText="true"
            :height="45"
            title="Envidat Team"
            :icon="iconName('team')"
          />
        </v-col>
      </v-row>
      <v-row class="category-title w-100">
        <v-col cols="12">
          <span class="text-h6 font-weight-bold">{{ postTitle }}</span>
        </v-col>
      </v-row>
      <v-row class="category-subtitle">
        <v-col>
          <div v-html="postText"></div>
        </v-col>
      </v-row>
      <v-row class="category-action">
        <v-col class="d-flex justify-space-between">
          <div v-if="postDate" class="text-body-1">
            {{ postDate }}
          </div>
          <v-btn v-if="showButton" color="secondary" @click="cardClick">
            View
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';
import { extractIcons } from '@/factories/iconFactory';

const props = defineProps({
  postTitle: String,
  postDate: String,
  postText: {
    type: String,
    default: '',
  },
  showButton: {
    type: Boolean,
    default: false,
  },
  height: String,
});

const emit = defineEmits(['clicked']);
const hover = ref(false);

const iconName = (data) => extractIcons(data);

function cardClick() {
  emit('clicked');
}
</script>

<style scoped>
/* Add your component styles here if needed */
</style>
