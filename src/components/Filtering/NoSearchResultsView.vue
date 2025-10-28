<template>
  <v-row>
    <v-col cols="12" class="py-4">
      <v-alert type="warning">
        {{ noResultText }}
      </v-alert>
    </v-col>

    <v-col cols="12">
      <div class="text-body-1">{{ suggestionText }}</div>
    </v-col>

    <v-col cols="12">
      <v-container class="pa-0" fluid>
        <v-row justify="center" no-gutters>
          <v-col
            v-for="card in categoryCardsNoMode"
            :key="card.title"
            class="pa-2 d-block"
            cols="auto"
          >
            <BaseCategoryCard
              height="45"
              :elevation="5"
              :title="card.title"
              :icon="card.iconPath"
              :color="card.darkColor"
              :isMode="card.isMode"
              :contain="card.contain"
              :disabled="card.disabled"
              @click="catchCategoryClicked(card.type)"
            />
          </v-col>
          <v-col
            v-for="card in categoryCardsMode"
            :key="card.title"
            class="pa-2 d-block"
            cols="auto"
          >
            <BaseCategoryCard
              height="45"
              :elevation="5"
              :title="card.title"
              :img="card.imgPath"
              :icon="card.iconPath"
              :color="card.darkColor"
              :isMode="card.isMode"
              :contain="card.contain"
              :disabled="card.disabled"
              @click="catchCategoryClicked(card.type)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-col>
  </v-row>
</template>

<script>
/**
 * NoSearchResults.vue is used to communicate to the users
 * that there aren't any results the used search parameters.
 *
 * @summary card with img, title, keywords and preview description
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-11-03 12:39:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';

export default {
  name: 'NoSearchResultView',
  props: {
    categoryCards: {
      type: Array,
      default: () => [],
    },
    categoryColor: {
      type: String,
      default: '#35A89D',
    },
  },
  data() {
    return {
      noResultText: 'Nothing found for these search criteria.',
      suggestionText: 'Change the criteria or try one of these categories',
    };
  },
  computed: {
    categoryCardsNoMode() {
      return this.categoryCards.filter((el) => !el.isMode);
    },
    categoryCardsMode() {
      return this.categoryCards.filter((el) => el.isMode);
    },
  },
  methods: {
    catchCategoryClicked(cardTitle) {
      this.$emit('clicked', cardTitle);
    },
  },
  components: {
    // BaseClickCard,
    BaseCategoryCard,
  },
};
</script>
