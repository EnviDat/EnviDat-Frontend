<template>
  <v-card
    ripple
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="pa-6 fill-height rounded-xl elevation-5 info-card"
    :dark="false"
  >
    <v-container class="info-wrapper fill-height align-start">
      <v-row>
        <v-col cols="12" class="d-md-flex">
          <v-row class="info-action mt-6 mt-md-0">
            <v-col cols="12" v-if="info.icon" class="d-flex flex-column align-center justify-center">
              <!-- Display icon based on info type using extractIcons -->
              <v-icon class="mr-1 mb-md-10 info-icon" :size="100" :color="'#000'">
                {{ computedIcon }}
              </v-icon>
            </v-col>
          </v-row>
        </v-col>

        <!-- Info text section -->
        <v-col cols="12">
          <v-row class="info-text h-100 ga-4">
            <v-col cols="12" class="pa-0 info-title" v-if="info.title">
              <span class="text-h6 text-md-h5 font-weight-bold">{{ info.title }}</span>
            </v-col>

            <v-col
              cols="12"
              v-if="info.subtitle"
              class="info-subtitle text-subtitle-1 pa-0"
              v-html="info.subtitle"
            ></v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="info.actionTitle" class="mt-5 fill-height">
        <v-col class="d-flex justify-end align-end">
          <v-btn color="secondary" @click="cardClick">
            {{ info.actionTitle }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { mdiMapPlus } from '@mdi/js';
import { useRouter } from 'vue-router';
import { extractIcons } from '@/factories/iconFactory';

// Define component props
const props = defineProps({
  info: Object,
  index: Number,
});

const router = useRouter();

const computedIcon = computed(() => extractIcons(props.info?.icon) || mdiMapPlus);

const hover = ref(false);

const navigateTo = (path) => {
  if (router.path === path) {
    return;
  }

  const isLink = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/;

  if (isLink.test(path)) {
    window.open(path, '_blank');
    return;
  }

  router.push({
    path,
    query: '',
  });
};

function cardClick() {
  navigateTo(props.info?.action);
}
</script>

<style lang="scss" scoped>
.info-wrapper {
  display: grid;
  grid-template-rows: minmax(200px, auto) auto;
}
</style>
