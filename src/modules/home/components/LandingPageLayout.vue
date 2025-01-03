<template>
  <article
    class="landingPageGrid pa-0"
    :class="{
      gridXs: isXsOnly,
      gridSm: isSmOnly,
    }"
    id="LandingPage"
  >
    <v-container v-if="$slots.welcome" class="welcomeGrid" :class="paddings">
      <slot name="welcome"></slot>

      <v-container class="pt-8">
        <slot name="search"></slot>
      </v-container>

      <div class="pt-2">
        <slot name="categories"></slot>
      </div>
    </v-container>

    <v-container v-if="$slots.datasets" class="datasetsGrid" :class="paddings">
      <BaseTitle
        style="text-align: center"
        :text="datasetsTitle"
        :className="'text-h4 font-weight-bold mb-6 position-relative'"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />

      <v-container class="pt-2 px-1">
        <slot name="datasets"></slot>
      </v-container>
    </v-container>

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

    <v-container
      v-if="$slots.articles"
      class="articlesGrid"
      :class="`${paddings} pb-4 pb-sm-0`"
    >
      <BaseTitle
        style="text-align: center"
        :text="articlesTitle"
        :className="'text-h4 font-weight-bold mb-6'"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />

      <div class="pt-2">
        <slot name="articles"></slot>
      </div>
    </v-container>
  </article>
</template>

<script>
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import BaseTitle from '@/components/BaseElements/BaseTitle.vue';


export default {
  name: 'LandingPageLayout',
  props: {
    categoriesTitle: String,
    datasetsTitle: String,
    newsTitle: String,
    infoTitle: String,
    articlesTitle: String,
    datasetsTotal: {
      type: Number,
      default: 0,
    },
  },
  components: {
    BaseTitle,
  },
  setup() {
    const display = useDisplay();

    // Computed properties per i breakpoint
    const isXsOnly = computed(() => display.xsOnly);
    const isSmOnly = computed(() => display.smOnly);

    return {
      isXsOnly,
      isSmOnly,
    };
  },
  computed: {
    paddings() {
      return 'pa-md-2 pt-4 pt-sm-6';
    },
  },
};
</script>

<style scoped>
@media screen and (min-width: 1340px) {
  .landingPageGrid {
    display: grid;
    gap: 100px;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      'Welcome'
      'Datasets'
      'Info'
      'News';
  }
}

.landingPageGrid.gridSm {
  grid-template-columns: 1fr;
  grid-template-rows: none;
  grid-template-areas:
    'Welcome'
    'Datasets'
    'Info'
    'News';
}

.landingPageGrid.gridXs {
  grid-template-columns: 1fr;
  grid-template-rows: none;
  grid-template-areas:
    'Welcome'
    'Datasets'
    'Info'
    'News';
}

.welcomeGrid {
  grid-area: Welcome;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.datasetsGrid {
  grid-area: Datasets;
}

.infoGrid {
  grid-area: Info;
}

.articlesGrid {
  grid-area: Articles;
}

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
