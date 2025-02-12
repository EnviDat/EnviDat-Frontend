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
            color="#35A89D"
            :blackText="true"
            :height="45"
            title="Blog article"
            :icon="iconName('post')"
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
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam eos
          saepe explicabo. Blanditiis cumque officia enim velit suscipit tenetur
          distinctio eveniet, dolorum perferendis, nulla commodi amet, magnam
          sunt nam repudiandae.
        </v-col>
      </v-row>
      <v-row class="category-action">
        <v-col class="d-flex justify-space-between">
          <div v-if="postDate" class="text-body-1">
            {{ postDate }}
          </div>
          <v-btn color="secondary" @click="cardClick">Read</v-btn>
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
});

const emit = defineEmits(['clicked']);

const hover = ref(false);

const getCategoryName = ref('');

const iconName = (data) => extractIcons(data);

function cardClick() {
  emit('clicked');
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
