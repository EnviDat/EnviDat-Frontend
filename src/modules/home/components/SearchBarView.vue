<template>
  <v-container
    :style="containerStyle"
    class="pa-0 mb-10 mb-md-0 overflow-hidden"
  >
    <v-row
      align="center"
      justify="space-between"
      class="grow flex-column"
      no-gutters
    >
      <v-col class="grow py-1">
        <v-text-field
          class="ma-0 main-search-bar"
          outlined
          bg-color="#fff"
          rounded="lg"
          density="comfortable"
          v-model="searchText"
          :prepend-inner-icon="searchIcon"
          :label="labelText"
          @click:prepend="clicked"
          @keyup.enter="clicked"
        />
      </v-col>

      <v-col
        v-if="hasButtonComputed"
        class="shrink py-0 d-flex align-center justify-center"
      >
        <base-rectangle-button
          v-for="(button, i) in buttonText"
          :key="i"
          :button-text="button.text"
          :color="button.class"
          :isOutlined="button.outlined"
          :bgcWhite="button.bgcWhite"
          :marginClass="'mr-5 ml-5'"
          :isXLarge="true"
          @clicked="() => clicked(button.action)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useDisplay } from 'vuetify';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { mdiMagnify } from '@mdi/js';

const props = defineProps({
  labelText: {
    type: String,
    default: '',
  },
  buttonText: {
    type: Array,
    default: () => [],
  },
  hasButton: {
    type: Boolean,
    default: false,
  },
});

const searchIcon = mdiMagnify;

const emit = defineEmits(['clicked', 'searchEmpty']);

const { mdAndUp } = useDisplay();

const containerStyle = computed(() => {
  if (mdAndUp.value) {
    return { maxWidth: '50%' };
  }
  return { maxWidth: '100%' };
});

const hasButtonComputed = computed(
  () => props.hasButton && props.buttonText.length > 0,
);

const searchText = ref('');

const clicked = () => {
  emit('clicked', 'search', searchText.value);
};

watch(searchText, (newVal) => {
  if (!newVal) {
    emit('searchEmpty');
  }
});
</script>

<style scoped></style>
