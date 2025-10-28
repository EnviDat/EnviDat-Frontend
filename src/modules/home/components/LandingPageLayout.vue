<template>
  <article class="landingPageGrid pa-0" :class="{ gridXs: isXsOnly, gridSm: isSmOnly }" id="LandingPage">
    <!-- Welcome Slot -->
    <v-container fluid v-if="$slots.welcome" class="welcomeGrid" :class="paddings">
      <slot name="welcome"></slot>
      <v-container class="pt-8">
        <slot name="search"></slot>
      </v-container>
      <section fluid class="metadata-wrapper">
        <BaseTitle
          style="text-align: center"
          :text="newsTitle"
          :className="'text-md-h4 text-h5 mt-10 font-weight-bold mb-6 position-relative'"
          cardClass="pa-2"
          titleClass="titleCardClass"
        />
        <v-container :fluid="$vuetify.display.lgAndDown" class="pt-2" :class="{ 'pa-0': $vuetify.display.smAndDown }">
          <slot name="news"></slot>
        </v-container>
      </section>
    </v-container>

    <!-- Info Slot -->
    <v-container v-if="$slots.info" fluid class="infoGrid background-grey">
      <BaseTitle
        style="text-align: center"
        :text="infoTitle"
        :className="'text-md-h4 text-h5 font-weight-bold mb-6'"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />
      <v-container :fluid="$vuetify.display.lgAndDown" class="pt-2" :class="{ 'pa-0': $vuetify.display.smAndDown }">
        <slot name="info"></slot>
      </v-container>
    </v-container>

    <!-- News Slot -->
    <v-container fluid v-if="$slots.news" class="newsGrid mt-4" :class="paddings">
      <section fluid>
        <BaseTitle
          style="text-align: center"
          :text="datasetsTitle"
          :className="'text-md-h4 text-h5 font-weight-bold mb-6'"
          cardClass="pa-2"
          titleClass="titleCardClass"
        />
        <v-container :fluid="$vuetify.display.lgAndDown" class="pt-2" :class="{ 'pa-0': $vuetify.display.smAndDown }">
          <slot name="datasets"></slot>
        </v-container>
      </section>
    </v-container>

    <!-- Contact Slot -->
    <v-container fluid v-if="$slots.contact" class="contactGrid background-grey" :class="paddings">
      <v-container fluid class="pt-2">
        <slot name="contact"></slot>
      </v-container>
    </v-container>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import BaseTitle from '@/components/BaseElements/BaseTitle.vue';

// Define component props
defineProps({
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

// Define padding classes as a constant string
const paddings = 'pa-md-2 pt-4 pt-sm-6';
</script>

<style scoped lang="scss">
.landingPageGrid.gridSm,
.landingPageGrid.gridXs {
  grid-template-columns: 1fr;
  grid-template-rows: none;
  grid-template-areas:
    'Welcome'
    'Info'
    'News'
    'Contact';
}

/* Additional styling */

.welcomeGrid {
  grid-area: Welcome;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: auto;
  min-height: 100vh;
  position: relative;
  width: 100%;
  margin-bottom: 30px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw; // full viewport width
    height: 100%;
    background-image: url('@/assets/app_b_landingpage.webp');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
}

.infoGrid {
  grid-area: Info;
  margin-top: -100px;
}

.newsGrid {
  grid-area: News;
}
.contactGrid {
  grid-area: Contact;
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
.background-grey {
  background-color: rgba(245, 245, 245, 0.75);
  // background-color: red;
  padding-top: 100px;
  padding-bottom: 20px;
}

.landingPageGrid {
  display: flex;
  flex-direction: column;
}

@media screen and (min-width: 1340px) {
  .landingPageGrid {
    display: grid;
    gap: 100px;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      'Welcome'
      'Info'
      'News'
      'Contact';
  }
  .welcomeGrid {
    margin-bottom: 0;
  }
}

@media screen and (min-width: 968px) {
  .metadata-wrapper {
    margin-top: 50px;
  }
}
</style>

<style>
/* Global styles */
</style>
