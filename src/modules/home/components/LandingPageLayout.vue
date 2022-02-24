<template>
  <article class="landingPageGrid pa-0"
           id="LandingPage">

    <div class="logoGrid pa-2">
      <slot name="logo"></slot>
    </div>

    <div class="welcomeGrid pa-2">
      <slot name="welcome"></slot>

      <div class="pt-6">
        <slot name="search"></slot>
      </div>
    </div>

    <div class="newsGrid pa-2">

      <div class="">
        <slot name="news"></slot>
      </div>
    </div>

    <div class="categoriesGrid pa-2">

        <TitleCard :title="categoriesTitle"
                    cardClass="pa-2"
                    titleClass="titleCardClass"/>

        <div class="pt-2">
          <slot name="categories"></slot>
        </div>

    </div>

    <div class="datasetsGrid pa-2">

      <TitleCard :title="datasetsTitle"
                 cardClass="pa-2"
                 titleClass="titleCardClass"/>

      <div class="pt-2 px-1">
        <slot name="datasets"></slot>
      </div>
    </div>

    <div class="articlesGrid pa-2">

      <TitleCard :title="articlesTitle"
                 cardClass="pa-2"
                 titleClass="titleCardClass"/>

      <div class="pt-2">
        <slot name="articles"></slot>
      </div>
    </div>

  </article>
</template>

<script>/**
 * LandingPageLayout.vue.vue
 *
 * @summary implements the different layout for the landing page
 * @author Haas
 *
 * Created at     : 2022-02-21
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import TitleCard from '@/components/Cards/TitleCard';

export default {
  name: 'LandingPageLayout',
  props: {
    categoriesTitle: String,
    datasetsTitle: String,
    newsTitle: String,
    articlesTitle: String,
  },
  components: {
    TitleCard,
  },
};
</script>

<style scoped>

.landingPageGrid {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  grid-template-rows: 4fr 1fr 4fr;
  gap: 10px;
  grid-template-areas:
    "Logo Welcome Categories"
    ". . ."
    "News Datasets Articles"
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
