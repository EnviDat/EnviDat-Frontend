<template>
  <v-container fluid class="pa-0" tag="article" id="LandingPage">
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
          :slogan="welcomeInfo.Slogan"
          :subSlogan="welcomeInfo.SubSlogan"
          :maxHeight="200"
          :buttonText="sloganButtonText"
          :moreButtonText="sloganMoreButtonText"
          :moreButtonCallback="catchMoreClicked"
        />
        <SearchBarView
          v-if="isMediumScreenAndDown"
          :labelText="welcomeInfo.searchLabelText"
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
              :height="'45'"
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
        <v-row justify="center" class="flex-grow-0" no-gutters>
          <!-- Mode Category -->
          <v-col
            v-for="card in categoryCardsMode"
            :key="card.title"
            class="pa-2 d-block"
            cols="auto"
          >
            <BaseCategoryCard
              :height="'45'"
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
        <v-row v-if="loadingMetadatasContent" no-gutters>
          <v-col v-for="index in 2" :key="index" cols="6" class="pa-2">
            <MetadataCardPlaceholder id="orgaDataset" class="mx-2" />
          </v-col>
        </v-row>
        <v-row v-else no-gutters>
          <v-col
            v-for="(metadata, index) in recentMetadata"
            :key="index"
            cols="12"
            md="6"
            xl="3"
            class="pa-2"
          >
            <MetadataCardLandingPage
              :categoryBelow="true"
              :id="metadata.id"
              :title="metadata.title"
              :subtitle="metadata.notes"
              :name="metadata.name"
              :date="metadata.metadata_created"
              :categoryName="metadata.categoryName"
              :categoryColor="metadata.categoryColor"
              @clickedEvent="catchMetadataClicked"
            />
          </v-col>
        </v-row>
      </template>

      <!-- Info slot -->
      <template v-if="showInfo" #info>
        <v-row>
          <v-col
            v-for="(info, i) in infoCards"
            :key="i"
            cols="12"
            :class="[
              i === 0 ? 'pa-md-16 pt-md-0' : 'pa-md-16',
              { 'pb-md-0': i === infoCards.length - 1 },
              { 'background-grey': i % 2 === 1 },
            ]"
          >
            <v-container>
              <InfoCards :index="i" :info="info" />
            </v-container>
          </v-col>
        </v-row>
      </template>

      <!-- News slot -->
      <template v-if="showNews" #news>
        <v-row no-gutters>
          <v-col
            v-for="(post, index) in newsEntries"
            :key="index"
            cols="12"
            md="6"
            class="pa-2"
          >
            <TeamPostCard
              :postTitle="post.title"
              :postDate="post.date"
              :postText="post.text"
              :showButton="false"
              :loadingImg="fallbackCardImg"
              titleCssClass="compactBlogPostCard"
              subtitleCssClass="text-caption"
              :height="isLargeScreen ? '100' : '75'"
              @clicked="catchPostClick(post.postFile)"
            />
          </v-col>
          <v-col
            v-for="(post, index) in blogPosts"
            :key="index"
            cols="12"
            md="6"
            class="pa-2"
          >
            <BlogPostCardLandingPage
              :postTitle="post.title"
              :postDate="post.date"
              :icon="'mdiAccountGroup'"
              :loadingImg="fallbackCardImg"
              titleCssClass="compactBlogPostCard"
              subtitleCssClass="text-caption"
              :height="isLargeScreen ? '100' : '75'"
              @clicked="catchPostClick(post.postFile)"
            />
          </v-col>
        </v-row>
      </template>

      <template v-if="showContact" #contact>
        <v-row>
          <v-col cols="12" class="background-grey">
            <v-container> <LandingPageContactForm /> </v-container>
          </v-col>
        </v-row>
      </template>
    </LandingPageLayout>
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { eventBus, SHOW_REDIRECT_SIGNIN_DIALOG } from '@/factories/eventBus';
import LandingPageLayout from '@/modules/home/components/LandingPageLayout.vue';
import SearchBarView from '@/modules/home/components/SearchBarView.vue';
import LandingPageContactForm from '@/modules/home/components/LandingPageContactForm.vue';
import SloganCard from '@/modules/home/components/SloganCard.vue';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';
import MetadataCardLandingPage from '@/components/Cards/MetadataCardLandingPage.vue';
import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import InfoCards from '@/components/Cards/InfoCards.vue';
import TeamPostCard from '@/modules/home/components/TeamPostCard.vue';
import BlogPostCardLandingPage from '@/modules/blog/components/BlogPostCardLandingPage.vue';
import { useDisplay } from 'vuetify';
import { importStoreModule } from '@/factories/enhancementsFactory';

// Import route constants and Vuex constants
import {
  ABOUT_PATH,
  BLOG_PAGENAME,
  BROWSE_PATH,
  LANDING_PAGENAME,
  METADATADETAIL_PAGENAME,
  USER_SIGNIN_PATH,
} from '@/router/routeConsts';
import {
  SET_CURRENT_PAGE,
  SET_APP_BACKGROUND,
} from '@/store/mainMutationsConsts';
import {
  BLOG_NAMESPACE,
  GET_BLOG_LIST,
} from '@/modules/blog/store/blogMutationsConsts';
import {
  METADATA_NAMESPACE,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';

import smLogoImport from '@/assets/logo/EnviDat_logo_64.png';
import mdLogoImport from '@/assets/logo/EnviDat_logo_128.png';

// beforeRouteEnter equivalent is gestito in un blocco separato (vedi sotto)

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

// mounted
onMounted(() => {
  window.scrollTo(0, 0);
  removeBackgroundImage();
});

// setup
const display = useDisplay();
const router = useRouter();

// computed
const categoryCards = computed(() => store.state.categoryCards);
const config = computed(() => store.state.config);
const loadingConfig = computed(() => store.state.loadingConfig);
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
const effectsConfig = computed(() => config.value?.effectsConfig || {});
const sloganButtonText = computed(() => 'EXPLORE DATA');
const sloganMoreButtonText = computed(() =>
  isLargeScreen.value ? 'ABOUT ENVIDAT' : 'ABOUT',
);

// methods
function removeBackgroundImage() {
  const appContainer = document.getElementById('app-container');
  if (appContainer) {
    appContainer.style.backgroundImage = 'none';
  }
}

function catchCategoryClicked(cardType) {
  if (cardType.includes('login')) {
    catchSigninClick();
    return;
  }
  if (cardType.includes('mode')) {
    const [, modeName] = cardType.split('_');
    catchModeClicked(modeName);
    return;
  }
  const stringTags = mixinMethods_convertArrayToUrlString([cardType]);
  mixinMethods_additiveChangeRoute(BROWSE_PATH, '', stringTags);
}

function catchModeClicked(mode) {
  router.push({
    path: BROWSE_PATH,
    query: { mode },
  });
}

function catchActionsButton(event, search) {
  const query = event === 'search' ? { search } : {};
  router.push({ path: BROWSE_PATH, query });
}

function catchMoreClicked() {
  router.push({ path: ABOUT_PATH });
}

function catchSigninClick() {
  if (config.value?.maintenanceConfig?.signinRedirectActive) {
    eventBus.emit(SHOW_REDIRECT_SIGNIN_DIALOG);
  } else if (router.currentRoute.value.path !== USER_SIGNIN_PATH) {
    router.push({ path: USER_SIGNIN_PATH });
  }
}

function catchMetadataClicked(datasetname) {
  store.commit(
    `${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`,
    router.currentRoute.value,
  );
  router.push({
    name: METADATADETAIL_PAGENAME,
    params: { metadataid: datasetname },
  });
}

function catchPostClick(post) {
  if (router.currentRoute.value.params?.post !== post) {
    router.push({
      name: BLOG_PAGENAME,
      params: { post },
    });
  }
}

function mixinMethods_convertArrayToUrlString(array) {
  return array.join(',');
}

function mixinMethods_additiveChangeRoute(path, query, tags) {
  router.push({
    path,
    query: { ...query, tags },
  });
}

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
  Slogan: 'Environmental Research Data at your Fingertips',
  SubSlogan:
    'EnviDat provides research data from Switzerland and around the world. The data is provided by researchers from various research units of the Swiss Federal Institute for Forest, Snow and Landscape WSL.',
  searchLabelText:
    'Looking for something specific? Enter research term, topic or author here!',
  smallSearchLabelText: 'Enter research term, topic or author',
  searchText: 'Looking for something specific?',
  categoryText:
    'Have a look at one of these categories or sign in to upload your data',
  articlesTitle: 'Recent EnviDat Blog Articles',
  newsTitle: 'News From The EnviDat Team',
  infoTitle: 'How it works?',
  categoriesTitle: 'Research Data Categories',
  datasetsTitle: 'Recently Published Research Datasets',
});
const fileIconString = ref('');
const alternativeText = ref('EnviDat logo');
const fallbackCardImg = ref(null);
const pageBGImage = ref('asd');
const smLogo = ref(smLogoImport);
const mdLogo = ref(mdLogoImport);
</script>

<script>
// beforeRouteEnter remains outside <script setup>
export const beforeRouteEnter = (to, from, next) => {
  next((vm) => {
    vm.$store.commit(SET_CURRENT_PAGE, LANDING_PAGENAME);
    vm.$store.commit(SET_APP_BACKGROUND, vm.pageBGImage);
  });
};
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
