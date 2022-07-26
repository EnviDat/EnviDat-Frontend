<template>
  <article
    class="landingPageGrid pa-0"
    :class="{
      gridXs: $vuetify.breakpoint.xsOnly,
      gridSm: $vuetify.breakpoint.smOnly,
    }"
    id="LandingPage"
  >
    <!--    'gridXl' : $vuetify.breakpoint.xlOnly,-->

    <div v-if="$slots.logo" class="logoGrid" :class="paddings">
      <slot name="logo"></slot>
    </div>

    <div v-if="$slots.welcome" class="welcomeGrid" :class="paddings">
      <slot name="welcome"></slot>

      <div class="pt-8">
        <slot name="search"></slot>
      </div>
    </div>

    <div v-if="$slots.categories" class="categoriesGrid" :class="paddings">
      <TitleCard
        :title="categoriesTitle"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />

      <div class="pt-2">
        <slot name="categories"></slot>
      </div>
    </div>

    <div v-if="$slots.datasets" class="datasetsGrid" :class="paddings">
      <TitleCard
        :title="datasetsTitle"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />

      <div class="pt-2 px-1">
        <slot name="datasets"></slot>
      </div>
    </div>

    <div v-if="$slots.news" class="newsGrid" :class="paddings">
      <div class="">
        <slot name="news"></slot>
      </div>
    </div>

    <div v-if="$slots.articles" class="articlesGrid" :class="paddings">
      <TitleCard
        :title="articlesTitle"
        cardClass="pa-2"
        titleClass="titleCardClass"
      />

      <div class="pt-2">
        <slot name="articles"></slot>
      </div>
    </div>
  </article>
</template>

<script>
/**
 * LandingPageLayout.vue
 *
 * @summary implements the different layout for the landing page
 * @author Haas
 *
 * Created at     : 2022-02-21
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import TitleCard from '@/components/Cards/TitleCard.vue';

export default {
  name: 'LandingPageLayout',
  props: {
    categoriesTitle: String,
    datasetsTitle: String,
    newsTitle: String,
    articlesTitle: String,
  },
  computed: {
    paddings() {
      return 'pa-md-2 pt-4 pt-sm-6';
    },
  },
  components: {
    TitleCard,
  },
};
</script>

<style scoped>
.landingPageGrid {
  display: grid;
  gap: 10px;
  grid-template-columns: 2fr 2fr 1fr;
  grid-template-rows: 4fr 0.25fr auto;
  grid-template-areas:
    'Logo Welcome Categories'
    '. . .'
    'News Datasets Articles';
}

@media screen and (min-width: 1921px) {
  .landingPageGrid {
    grid-template-columns: 2fr 2fr 2fr 2fr;
    grid-template-rows: 1fr 0.25fr auto;
    grid-template-areas:
      '. Logo Welcome Categories'
      '. . . .'
      '. News Datasets Articles';
  }
}

.landingPageGrid.gridSm {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: none;
  grid-template-areas:
    'Welcome Welcome'
    'News News'
    'Datasets Categories'
    '. Articles';
}

.landingPageGrid.gridXs {
  grid-template-columns: 1fr;
  grid-template-rows: none;
  grid-template-areas:
    'Welcome'
    'News'
    'Datasets'
    'Categories'
    'Articles';
}

.logoGrid {
  grid-area: Logo;
}

.welcomeGrid {
  grid-area: Welcome;
}

.datasetsGrid {
  grid-area: Datasets;
}

.categoriesGrid {
  grid-area: Categories;
}

.newsGrid {
  grid-area: News;
}

.articlesGrid {
  grid-area: Articles;
}
</style>

<style>
.titleCardClass {
  font-size: 1.25rem;
  word-break: break-word;
  line-height: 1.5rem !important;
  font-weight: 500;
  letter-spacing: normal !important;
}
</style>
