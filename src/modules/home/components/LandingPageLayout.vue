<template>
  <article
    class="landingPageGrid pa-0"
    :class="{ gridXs: isXsOnly, gridSm: isSmOnly }"
    id="LandingPage"
  >
    <!-- Welcome Slot -->
    <v-container v-if="$slots.welcome" class="welcomeGrid" :class="paddings">
      <slot name="welcome"></slot>
      <v-container class="pt-8">
        <slot name="search"></slot>
      </v-container>
      <section class="metadata-wrapper">
        <BaseTitle
          style="text-align: center"
          :text="datasetsTitle"
          :className="'text-h4 mt-10 margin-asd font-weight-bold mb-6 position-relative'"
          cardClass="pa-2"
          titleClass="titleCardClass"
        />
        <v-container class="pt-2 px-1">
          <slot name="datasets"></slot>
        </v-container>
      </section>
    </v-container>

    <!-- Info Slot -->
    <v-container fluid v-if="$slots.info" class="infoGrid" :class="paddings">
      <BaseTitle
        style="text-align: center"
        :text="infoTitle"
        :className="'text-h4 font-weight-bold mb-6'"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />
      <v-container fluid class="pt-2 px-1">
        <slot name="info"></slot>
      </v-container>
    </v-container>

    <!-- News Slot -->
    <v-container v-if="$slots.news" class="newsGrid" :class="paddings">
      <BaseTitle
        style="text-align: center"
        :text="newsTitle"
        :className="'text-h4 font-weight-bold mb-6'"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />
      <div class="pt-2">
        <slot name="news"></slot>
      </div>
    </v-container>
  </article>
</template>

<script setup>
// Import required functions and components
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import BaseTitle from '@/components/BaseElements/BaseTitle.vue';

// Define component props
const props = defineProps({
  categoriesTitle: String,
  datasetsTitle: String,
  newsTitle: String,
  infoTitle: String,
  articlesTitle: String,
  datasetsTotal: {
    type: Number,
    default: 0,
  },
});

// Get display info for responsive breakpoints
const display = useDisplay();
const isXsOnly = computed(() => display.xsOnly);
const isSmOnly = computed(() => display.smOnly);

// Define padding classes as a constant (if fixed)
const paddings = 'pa-md-2 pt-4 pt-sm-6';
</script>

<style scoped lang="scss">
@media screen and (min-width: 1340px) {
  .landingPageGrid {
    display: grid;
    gap: 100px;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      'Welcome'
      'Info'
      'News';
  }
}

/* Use same grid structure for small screens */
.landingPageGrid.gridSm,
.landingPageGrid.gridXs {
  grid-template-columns: 1fr;
  grid-template-rows: none;
  grid-template-areas:
    'Welcome'
    'Info'
    'News';
}

/* Additional styling */
.metadata-wrapper {
  margin-top: 100px;
}

.welcomeGrid {
  grid-area: Welcome;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: auto;
  min-height: 100vh;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('https://envidat.ch/beta/static/app_b_landingpage-BjXUE1sY.webp');
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }

  // Ensure that the direct children are above the pseudo-element
  > * {
    position: relative;
    z-index: 1;
  }
}

.infoGrid {
  grid-area: Info;
}

/* .articlesGrid {
  grid-area: Articles;
} */

.newsGrid {
  grid-area: News;
}

.titleCardClass {
  font-size: 1.25rem;
  word-break: break-word;
  line-height: 1.5rem !important;
  font-weight: 500;
  letter-spacing: normal !important;
}

#firstContainer {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right;
}
</style>
