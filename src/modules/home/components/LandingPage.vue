<template>
  <LandingPageLayout
    :categoriesTitle="welcomeInfo.categoriesTitle"
    :datasetsTitle="welcomeInfo.datasetsTitle"
    :datasetsTotal="datasetsTotal"
    :newsTitle="welcomeInfo.newsTitle"
    :infoTitle="welcomeInfo.infoTitle"
    :articlesTitle="welcomeInfo.articlesTitle"
  >
    <!-- Welcome slot -->
    <template #welcome>
      <SloganCard
        class="pa-md-6 pt-md-0"
        :slogan="welcomeInfo.Slogan"
        :subSlogan="welcomeInfo.SubSlogan"
        :maxHeight="200"
        :buttonText="sloganButtonText"
        :moreButtonText="sloganMoreButtonText"
        :moreButtonCallback="catchMoreClicked"
      />
      <SearchBarView
        v-if="isMediumScreenAndDown"
        :labelText="
          display.xs
            ? welcomeInfo.smallSearchLabelText
            : welcomeInfo.searchLabelText
        "
        :buttonText="buttonsActions"
        :hasButton="true"
        @clicked="catchActionsButton"
      />

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
            :icon="card.iconPath"
            :color="card.darkColor"
            :isMode="card.isMode"
            :contain="card.contain"
            :disabled="card.disabled"
            @click="catchCategoryClicked(card.type)"
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
            @click="catchCategoryClicked(card.type)"
          />
        </v-col>
      </v-row>
    </template>

    <!-- Search slot -->
    <template #search>
      <SearchBarView
        v-if="isMediumScreenAndUp"
        :labelText="welcomeInfo.searchLabelText"
        :buttonText="buttonsActions"
        :hasButton="true"
        @clicked="catchActionsButton"
      />
    </template>

    <!-- Datasets slot -->
    <template #datasets>
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
      <v-row v-else>
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
            @clickedEvent="catchMetadataClicked"
          />
        </v-col>
      </v-row>
    </template>

    <!-- Info slot -->
    <template v-if="showInfo" #info>
      <v-row class="justify-center">
        <v-col v-for="(info, i) in infoCards" :key="i" cols="12" lg="4">
          <InfoCards :index="i" :info="info" />
        </v-col>
      </v-row>
    </template>

    <!-- News slot -->
    <template v-if="showNews" #news>
      <v-row>
        <v-col
          v-for="(post, index) in newsEntries"
          :key="index"
          cols="12"
          md="6"
          xl="3"
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
            @clickedEvent="catchPostClick(post.postFile)"
          />
        </v-col>
        <v-col
          v-for="(post, index) in blogPosts"
          :key="index"
          cols="12"
          md="6"
          xl="3"
        >
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
            @clickedEvent="catchPostClick(post.postFile)"
          />
        </v-col>
      </v-row>
    </template>

    <template v-if="showContact" #contact>
      <v-row>
        <v-col cols="12">
          <v-container> <LandingPageContactForm /> </v-container>
        </v-col>
      </v-row>
    </template>
  </LandingPageLayout>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

import { eventBus, SHOW_REDIRECT_SIGNIN_DIALOG } from '@/factories/eventBus';
import LandingPageLayout from '@/modules/home/components/LandingPageLayout.vue';
import SearchBarView from '@/modules/home/components/SearchBarView.vue';
import LandingPageContactForm from '@/modules/home/components/LandingPageContactForm.vue';
import SloganCard from '@/modules/home/components/SloganCard.vue';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';

import BaseCardLandingPage from '@/components/Cards/BaseCardLandingPage.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import InfoCards from '@/components/Cards/InfoCards.vue';

import { importStoreModule } from '@/factories/enhancementsFactory';

// Import route constants and Vuex constants
import {
  ABOUT_PATH,
  BLOG_PAGENAME,
  BROWSE_PATH,
  METADATADETAIL_PAGENAME,
  USER_SIGNIN_PATH,
} from '@/router/routeConsts';

import {
  BLOG_NAMESPACE,
  GET_BLOG_LIST,
} from '@/modules/blog/store/blogMutationsConsts';
import {
  METADATA_NAMESPACE,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';

// data
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

// beforeCreate
const store = useStore();
importStoreModule(
  store,
  'blog',
  () => import('@/modules/blog/store/blogStore'),
).then(() => {
  store.dispatch(`${BLOG_NAMESPACE}/${GET_BLOG_LIST}`);
});

// created
const blogModuleLoaded = ref(false);
blogModuleLoaded.value = !!store.state.blog;
store.watch(
  (state) => state.blog,
  (value) => {
    blogModuleLoaded.value = !!value;
  },
);

// setup
const display = useDisplay();
const router = useRouter();

// computed
const categoryCards = computed(() => store.state.categoryCards);
const config = computed(() => store.state.config);
const loadingMetadatasContent = computed(
  () => store.getters[`${METADATA_NAMESPACE}/loadingMetadatasContent`],
);
const metadatasContentSize = computed(
  () => store.getters[`${METADATA_NAMESPACE}/metadatasContentSize`],
);
const recentMetadata = computed(
  () => store.getters[`${METADATA_NAMESPACE}/recentMetadata`],
);
const blogList = computed(() => store.state[BLOG_NAMESPACE].list);

const isLargeScreen = computed(() => display.large);
const isMediumScreenAndDown = computed(
  () => display.sm.value || display.xs.value,
);
const categoryCardsNoMode = computed(() =>
  categoryCards.value.filter((el) => !el.isMode),
);
const categoryCardsMode = computed(() =>
  categoryCards.value.filter((el) => el.isMode),
);
const isMediumScreenAndUp = computed(
  () =>
    display.md.value ||
    display.lg.value ||
    display.xl.value ||
    display.xxl.value,
);
const blogPosts = computed(() =>
  blogModuleLoaded.value && blogList.value?.length > 0
    ? blogList.value.slice(0, 3)
    : [],
);
const welcomeInfo = computed(
  () => config.value?.welcomeInfo || defaultWelcomeInfo.value,
);
const infoCards = computed(() => config.value?.infoConfig?.info);
const showInfo = computed(() => config.value?.infoConfig?.infoActive);
const showNews = computed(() => config.value?.newsConfig?.newsActive);
const showContact = computed(() => config.value?.showContact?.contactActive);
const datasetsTotal = computed(() =>
  loadingMetadatasContent.value ? 0 : metadatasContentSize.value,
);
const newsEntries = computed(() => config.value?.newsConfig?.entries || []);
const sloganButtonText = 'EXPLORE DATA';
const sloganMoreButtonText = computed(() =>
  isLargeScreen.value ? 'ABOUT ENVIDAT' : 'ABOUT',
);

const mixinMethodsConvertArrayToUrlString = (array) => array.join(',');

const mixinMethodsAdditiveChangeRoute = (path, query, tags) => {
  router.push({
    path,
    query: { ...query, tags },
  });
};

const catchModeClicked = (mode) => {
  router.push({
    path: BROWSE_PATH,
    query: { mode },
  });
};

const catchActionsButton = (event, search) => {
  const query = event === 'search' ? { search } : {};
  router.push({ path: BROWSE_PATH, query });
};

const catchMoreClicked = () => {
  router.push({ path: ABOUT_PATH });
};

const catchSigninClick = () => {
  if (config.value?.maintenanceConfig?.signinRedirectActive) {
    eventBus.emit(SHOW_REDIRECT_SIGNIN_DIALOG);
  } else if (router.currentRoute.value.path !== USER_SIGNIN_PATH) {
    router.push({ path: USER_SIGNIN_PATH });
  }
};

const catchMetadataClicked = (datasetname) => {
  store.commit(
    `${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`,
    router.currentRoute.value,
  );
  router.push({
    name: METADATADETAIL_PAGENAME,
    params: { metadataid: datasetname },
  });
};

const catchPostClick = (post) => {
  if (router.currentRoute.value.params?.post !== post) {
    router.push({
      name: BLOG_PAGENAME,
      params: { post },
    });
  }
};

const catchCategoryClicked = (cardType) => {
  if (cardType.includes('login')) {
    catchSigninClick();
    return;
  }
  if (cardType.includes('mode')) {
    const [, modeName] = cardType.split('_');
    catchModeClicked(modeName);
    return;
  }
  const stringTags = mixinMethodsConvertArrayToUrlString([cardType]);
  mixinMethodsAdditiveChangeRoute(BROWSE_PATH, '', stringTags);
};

onMounted(async () => {
  window.scrollTo(0, 0);
});
</script>

<style scoped>
.compactBlogPostCard {
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1rem;
}
.background-grey {
  background-color: rgba(245, 245, 245, 0.75);
}
</style>

<!-- Global styles if needed -->
<style>
/* Global styles */
</style>
