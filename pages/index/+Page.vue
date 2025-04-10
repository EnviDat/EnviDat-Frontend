<template>
  <LandingPageLayout
    :categoriesTitle="defaultWelcomeInfo.categoriesTitle"
    :datasetsTitle="defaultWelcomeInfo.datasetsTitle"
    :datasetsTotal="datasetsTotal"
    :newsTitle="defaultWelcomeInfo.newsTitle"
    :infoTitle="defaultWelcomeInfo.infoTitle"
    :articlesTitle="defaultWelcomeInfo.articlesTitle"
  >
    <!-- Welcome slot -->
    <template #welcome>
      <SloganCard
        class="pa-md-6 pt-md-0"
        :slogan="defaultWelcomeInfo.Slogan"
        :subSlogan="defaultWelcomeInfo.SubSlogan"
        :maxHeight="200"
        buttonText="EXPLORE DATA"
        moreButtonText="ABOUT ENVIDAT"
      />

<!--
      <SearchBarView
        v-if="isMediumScreenAndDown"
        :labelText="
          display.xs
            ? defaultWelcomeInfo.smallSearchLabelText
            : defaultWelcomeInfo.searchLabelText
        "
        :buttonText="buttonsActions"
        :hasButton="true"

      />
-->

      <v-row justify="center" class="flex-grow-0" no-gutters>
        <!-- noMode Category -->
        <v-col
          v-for="card in categoryCardsNoMode"
          :key="card.title"
          class="pa-2"
          cols="auto"
        >
          <BaseCategoryCard
            height="45"
            :title="card.title"
            :img="card.imgPath"
            :icon="card.iconPath"
            :color="card.darkColor"
            :isMode="card.isMode"
            :contain="card.contain"
            :disabled="card.disabled"
          />
        </v-col>
      </v-row>
      <v-row justify="center" class="flex-grow-0" no-gutters>
        <!-- Mode Category -->
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
          />
        </v-col>
      </v-row>
    </template>

    <!-- Search slot -->
    <template #search>
      <SearchBarView
        :labelText="defaultWelcomeInfo.searchLabelText"
        :buttonText="buttonsActions"
        :hasButton="true"
      />
    </template>

    <!-- Datasets slot -->
    <template #datasets>
<!--
      <v-row v-if="loadingMetadatasContent">
        <v-col
          v-for="index in 4"
          :key="index"
          cols="12"
          md="6"
          xl="3"
          class="pt-3 pb-3"
        >
          <MetadataCardPlaceholder id="orgaDataset" class="mx-2" />
        </v-col>
      </v-row>
-->
<!--
      <v-row v-else>
-->
      <v-row>
        <v-col
          v-for="(metadata, index) in recentMetadata"
          :key="index"
          cols="12"
          md="6"
          xl="3"
        >
          <BaseCardLandingPage
            :cardType="'metadata'"
            :truncateSubTilte="true"
            :categoryBelow="true"
            :id="metadata.id"
            :title="metadata.title"
            :subtitle="metadata.notes"
            :categoryName="metadata.categoryName"
            :categoryColor="metadata.categoryColor"
            :date="metadata.metadata_created"
          />
        </v-col>
      </v-row>
    </template>

    <!-- Info slot -->
    <template v-if="defaultWelcomeInfo.infoConfig.infoActive" #info>
      <v-row class="justify-center">
        <v-col v-for="(info, i) in defaultWelcomeInfo.infoConfig.info" :key="i" cols="12" lg="4">
          <InfoCards :index="i" :info="info" />
        </v-col>
      </v-row>
    </template>

    <!-- News slot -->
<!--
    <template v-if="showNews" #news>
      <v-row>
        <v-col
          v-for="(post, index) in newsEntries"
          :key="index"
          cols="12"
          md="6"
        >
          <BaseCardLandingPage
            :cardType="'team'"
            :showButton="false"
            :id="post.id"
            :title="post.title"
            :subtitle="post.text"
            :date="post.date"
            :categoryName="'Envidat Team'"
            :categoryColor="'#aab2ff'"
            :categoryAbove="true"
            buttonText="View"
          />
        </v-col>

        <v-col v-for="(post, index) in blogPosts" :key="index" cols="12" md="6">
          <BaseCardLandingPage
            :cardType="'blog'"
            :id="post.id"
            :title="post.title"
            :subtitle="post.preview"
            :date="post.date"
            :truncateSubTilte="true"
            :categoryName="'Blog article'"
            :categoryColor="'#E0EF45E6'"
            :categoryAbove="true"
            :categoryBelow="false"
            buttonText="Read"
          />
        </v-col>

      </v-row>
    </template>
-->

    <template #contact>
      <v-row>
        <v-col cols="12">
          <v-container> <LandingPageContactForm /> </v-container>
        </v-col>
      </v-row>
    </template>
  </LandingPageLayout>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import store from '@/store/store';

import SearchBarView from '@/modules/home/components/SearchBarView.vue';
// import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import InfoCards from '@/components/Cards/InfoCards.vue';
import SloganCard from '@/modules/home/components/SloganCard.vue';
import LandingPageLayout from '@/modules/home/components/LandingPageLayout.vue';
import LandingPageContactForm from '@/modules/home/components/LandingPageContactForm.vue';
import BaseCardLandingPage from '@/components/Cards/BaseCardLandingPage.vue';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';


const loadingMetadatasContent = computed(
  () => store.getters[`${METADATA_NAMESPACE}/loadingMetadatasContent`],
);

const metadatasContentSize = computed(
  () => store.getters[`${METADATA_NAMESPACE}/metadatasContentSize`],
);

const datasetsTotal = computed(() =>
  loadingMetadatasContent.value ? 0 : metadatasContentSize.value,
);

const recentMetadata = computed(
  () => store.getters[`${METADATA_NAMESPACE}/recentMetadata`],
);

const categoryCards = computed(() => store.state.categoryCards);

const categoryCardsNoMode = computed(() =>
  categoryCards.value.filter((el) => !el.isMode),
);
const categoryCardsMode = computed(() =>
  categoryCards.value.filter((el) => el.isMode),
);

const buttonsActions = ref([
  { text: 'Search', class: 'primary', action: 'search' },
  {
    text: 'Explore all',
    class: 'primary',
    outlined: true,
    bgcWhite: true,
    action: 'explore',
  },
]);

const defaultWelcomeInfo = ref({
  titleText: 'EnviDat',
  Slogan: 'Environmental Research Data\n\rat your Fingertips',
  SubSlogan:
    'EnviDat provides research data from Switzerland and around the world.<br/> The data is provided by researchers from various research units of the Swiss Federal Institute for Forest, Snow and Landscape WSL.',
  searchLabelText:
    'Looking for something specific? Enter research term, topic or author here!',
  smallSearchLabelText: 'Enter research term, topic or author',
  searchText: 'Looking for something specific?',
  categoryText:
    'Have a look at one of these categories or sign in to upload your data',
  articlesTitle: 'Recent EnviDat Blog Articles',
  newsTitle: 'News From The EnviDat Team',
  infoTitle: 'How does EnviDat work?',
  categoriesTitle: 'Research Data Categories',
  datasetsTitle: 'Recently Published Research Datasets',
  showContact: {
    contactActive: true,
  },
  infoConfig: {
    infoActive: true,
    info: [
      {
        title: 'Designed for researcher needs',
        subtitle:
          'EnviDat is a user-friendly and open-source platform, specifically designed to meet the needs of researchers for storing, managing, and publishing environmental datasets. It provides structured metadata, integration with international data repositories, and long-term accessibility to support open science and reproducible research.',
        icon: 'heart',
        points: [],
        image: '',
        action: '/new',
        actionTitle: 'Create Dataset',
      },
      {
        title: 'FAIR data repository',
        subtitle:
          "EnviDat is supporting environmental researchers to share data according to the Findability, Accessibility, Interoperability, and Reusability (FAIR) principles. EnviDat is registered in <a href='https://fairsharing.org/biodbcore-001178/'>FAIRsharing.org</a> and <a href='https://www.re3data.org/repository/r3d100012587'>re3data.org</a> to enhance scientific collaboration and ensure that datasets remain discoverable and reusable by the global research community.",
        icon: 'protected',
        points: [],
        image: '',
        action:
          'https://www.ub.uzh.ch/en/wissenschaftlich-arbeiten/mit-daten-arbeiten/FAIR-und-Open-Data.html',
      },
      {
        title: 'Connected to the world',
        subtitle:
          "EnviDat disseminates its datasets globally in order to promote international research cooperation in the field of environmental science. EnviDat datasets are listed in the <a href='https://search.earthdata.nasa.gov/search?fdc=WSL&ac=true'>NASA EarthData portal</a>, the data.europa.eu <a href='https://data.europa.eu/data/datasets?country=ch&publisher=EnviDat'>European Open Data portal</a>, <a href='https://b2find9.cloud.dkrz.de/organization/envidat'>European Open Science Cloud Hub</a>, <a href='https://commons.datacite.org/doi.org?query=client.uid:ethz.wsl'>DataCite</a>, or <a href='https://opendata.swiss/en/organization/envidat'>opendata.swiss</a> so that scientific data is found and cited.",
        icon: 'world',
        points: [],
        image: '',
        action: '/browse',
        actionTitle: 'Browse all datasets',
      },
    ],
  },
});
</script>

<style scoped>
</style>
