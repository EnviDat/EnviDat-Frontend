<template>
  <v-card
    ripple
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="fill-height elevation-5 rounded-xl"
  >
    <v-container class="fill-height category-card">
      <v-card
        class="pa-3 fill-height elevation-0 rounded-xl d-flex flex-column bgcCard"
      >
        <v-row v-if="categoryAbove">
          <v-col cols="auto">
            <BaseCategoryCard
              class="mb-4"
              :elevation="0"
              :color="categoryColor"
              :disableClick="true"
              :height="45"
              :blackText="true"
              :title="getCategoryName"
              :icon="iconName('post')"
            />
          </v-col>
        </v-row>
        <v-row class="category-title" no-gutters>
          <v-col class="pa-0" cols="12">
            <span class="text-h6 font-weight-bold">{{ truncatedTitle }}</span>
          </v-col>
        </v-row>
        <v-row class="mt-0" v-if="categoryBelow">
          <v-col cols="auto">
            <BaseCategoryCard
              :elevation="0"
              :color="categoryColor"
              :disableClick="true"
              :height="25"
              :blackText="true"
              :title="getCategoryName"
              :icon="iconName('post')"
            />
          </v-col>
        </v-row>
        <v-row class="category-subtitle pt-3" no-gutters>
          <v-col class="pa-0">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam
            eos saepe explicabo. Blanditiis cumque officia enim velit suscipit
            tenetur distinctio eveniet, dolorum perferendis, nulla commodi amet,
            magnam sunt nam repudiandae. sit amet consectetur adipisicing elit.
            Quisquam eos saepe explicabo.
          </v-col>
        </v-row>
      </v-card>
      <v-row class="category-action">
        <v-col class="d-flex justify-space-between pa-6">
          <span class="text-body-1">{{ formattedDate }}</span>
          <v-btn color="secondary" @click="cardClick"> Read </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
// import { stripMarkdown } from '@/factories/stringFactory';
import { extractIcons } from '@/factories/iconFactory';
import { formatDate } from '@/factories/dateFactory';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';

const props = defineProps({
  id: String,
  postTitle: String,
  postContent: String,
  postDate: String,
  categoryColor: {
    type: String,
    default: '#35A89D',
  },
  categoryName: {
    type: String,
    default: 'Blog article',
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

const emit = defineEmits(['clickedEvent']);

const hover = ref(false);
const titleLength = ref(50);
// const contentLength = ref(200);

const getCategoryName = computed(() =>
  props.categoryName
    .split(' ')
    .map((word) =>
      word.length === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' '),
);

const truncatedTitle = computed(() => {
  const maxLength = titleLength.value;
  if (props.postTitle && props.postTitle.length > maxLength) {
    return `${props.postTitle.substring(0, maxLength)}...`;
  }
  return props.postTitle;
});

// const truncatedSubtitle = computed(() => {
//   const maxLength = contentLength.value;
//   const cleanContent = stripMarkdown(props.postContent, true);
//   if (cleanContent && cleanContent.length > maxLength) {
//     return `${cleanContent.substring(0, maxLength)}...`;
//   }
//   return cleanContent;
// });

const formattedDate = computed(() =>
  props.postDate ? formatDate(props.postDate, 'yyyy-MM-dd', true) : '',
);

const iconName = (data) => extractIcons(data);

function cardClick() {
  emit('clicked');
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
