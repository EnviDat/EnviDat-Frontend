<template>
  <v-card
    ripple
    @mouseover="hover = true"
    @mouseleave="hover = false"
    class="fill-height pt-md-14 pb-md-14 pb-6 pt-6 rounded-xl elevation-5 info-card"
    :dark="false"
  >
    <v-container
      :class="{ 'grey-background': hasGreyBackground }"
      class="ma-2 fill-height d-flex"
    >
      <v-row>
        <!-- Invert layout if grey background is present and on desktop -->
        <v-col
          v-if="hasGreyBackground"
          cols="12"
          md="4"
          class="d-md-flex"
          order-md="1"
          order="2"
        >
          <v-row class="info-action mt-6 mt-md-0">
            <v-col
              v-if="info.icon"
              class="d-flex flex-column align-center justify-center"
            >
              <!-- Display icon based on info type using extractIcons -->
              <v-icon
                class="mr-1 mb-md-10 info-icon"
                :size="iconSize"
                :color="'#000'"
              >
                {{ computedIcon }}
              </v-icon>
            </v-col>
          </v-row>
        </v-col>

        <!-- Info text section -->
        <v-col cols="12" md="8" order-md="2" order="1">
          <v-row class="info-text pl-md-10 pr-md-14 pl-7 pr-7 h-100 ga-4">
            <v-row class="info-title">
              <v-col class="pa-0" v-if="info.title">
                <span class="text-h6 text-md-h5 font-weight-bold">{{
                  info.title
                }}</span>
              </v-col>
            </v-row>

            <v-row v-if="info.subtitle" class="info-subtitle text-subtitle-1">
              <v-col class="pa-0">{{ info.subtitle }}</v-col>
            </v-row>

            <v-row v-if="info.points?.length > 0" class="info-points">
              <v-col>
                <v-list lines="two">
                  <v-list-item
                    v-for="point in info.points"
                    :key="point"
                    class="pa-0"
                  >
                    <span>- {{ point }}</span>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>

            <!-- Render action button if actionTitle is provided -->
            <v-row
              v-if="info.actionTitle"
              class="justify-center mt-5 justify-md-end"
            >
              <v-btn color="secondary" @click="cardClick">
                {{ info.actionTitle }}
              </v-btn>
            </v-row>
          </v-row>
        </v-col>

        <!-- Action part when grey background is not present -->
        <v-col
          v-if="!hasGreyBackground"
          cols="12"
          md="4"
          class="d-md-flex"
          order-md="3"
          order="2"
        >
          <v-row class="info-action mt-6 mt-md-0">
            <v-col
              v-if="info.icon"
              class="d-flex flex-column align-center justify-center"
            >
              <v-icon
                class="mr-1 mb-md-10 info-icon"
                :size="iconSize"
                :color="'#000'"
              >
                {{ computedIcon }}
              </v-icon>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { mdiMapPlus } from '@mdi/js';
import { extractIcons } from '@/factories/iconFactory';
import { useDisplay } from 'vuetify';

// Define component props
const props = defineProps({
  info: Object,
  index: Number,
});

const display = useDisplay();

const emit = defineEmits(['clickedEvent']);

const hasGreyBackground = computed(() => props.index % 2 === 0);

const iconSize = computed(() => (display.smAndDown.value ? 100 : 200));

const computedIcon = computed(
  () => extractIcons(props.info?.icon) || mdiMapPlus,
);

const hover = ref(false);

function cardClick() {
  const detailParam = props.info?.name || props.info?.id || '';
  emit('clickedEvent', detailParam);
}
</script>
