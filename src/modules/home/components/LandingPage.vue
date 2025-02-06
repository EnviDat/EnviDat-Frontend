<template>
  <v-container fluid class="pa-0" tag="article" id="LandingPage">
    <!-- <div
      v-show="showPolygonParticles"
      id="polygon-canvas"
      style="position: absolute; width: 99%; height: 325px; bottom: 0; left: 0;"
    /> -->

    <!--
    <div
      v-show="showPolygonParticles"
      id="polygon-canvas2"
      style="position: absolute; width: 400px; height: 300px; bottom: 30%; left: 22.5%;"
    />
    -->

    <LandingPageLayout
      :categoriesTitle="welcomeInfo.categoriesTitle"
      :datasetsTitle="welcomeInfo.datasetsTitle"
      :datasetsTotal="datasetsTotal"
      :newsTitle="welcomeInfo.newsTitle"
      :infoTitle="welcomeInfo.infoTitle"
      :articlesTitle="welcomeInfo.articlesTitle"
    >
      <template v-slot:welcome>
        <SloganCard
          :slogan="welcomeInfo.Slogan"
          :subSlogan="welcomeInfo.SubSlogan"
          :maxHeight="200"
          :buttonText="sloganButtonText"
          :buttonCallback="catchBrowseClicked"
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
        <v-row justify="center" no-gutters>
          <v-col
            v-for="card in categoryCards"
            :key="card.title"
            class="pa-2"
            cols="auto"
          >
            <BaseCategoryCard
              :height="isLargeScreen ? '40' : '30'"
              :title="card.title"
              :img="card.imgPath"
              :icon="card.iconPath"
              :color="card.darkColor"
              :contain="card.contain"
              :disabled="card.disabled"
              @click="catchCategoryClicked(card.type)"
            />
          </v-col>
        </v-row>
      </template>

      <template v-slot:info>
        <v-row>
          <v-col
            v-for="(info, i) in infoCards"
            cols="12"
            :key="i"
            :class="['pa-md-16', i % 2 === 0 ? 'background-grey' : '']"
          >
            <v-container>
              <InfoCards :index="i" :info="info" />
            </v-container>
          </v-col>
        </v-row>
      </template>

      <template v-slot:search>
        <SearchBarView
          v-if="isMediumScreenAndUp"
          :labelText="welcomeInfo.searchLabelText"
          :buttonText="buttonsActions"
          :hasButton="true"
          @clicked="catchActionsButton"
        />
      </template>

      <template v-slot:datasets>
        <v-row v-if="loadingMetadatasContent" no-gutters>
          <v-col v-for="index in 2" :key="index" cols="6" class="pa-2">
            <MetadataCardPlaceholder id="orgaDataset" class="mx-2" />
          </v-col>
        </v-row>
        <v-row v-if="!loadingMetadatasContent" no-gutters>
          <v-col
            v-for="(metadata, index) in recentMetadata"
            :key="index"
            cols="12"
            md="6"
            lg="3"
            class="pa-2"
          >
            <MetadataCardLandingPage
              :key="index"
              :id="metadata.id"
              :title="metadata.title"
              :subtitle="metadata.notes"
              :name="metadata.name"
              :categoryName="metadata.categoryName"
              :titleImg="metadata.titleImg"
              :resourceCount="metadata.num_resources"
              :fileIconString="fileIconString"
              :categoryColor="metadata.categoryColor"
              :compactLayout="true"
              @clickedEvent="catchMetadataClicked"
            />
          </v-col>
        </v-row>
      </template>

      <template v-slot:news>
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
              :showButton="true"
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
            <BlogPostCard
              :postTitle="post.title"
              :postDate="post.date"
              :loadingImg="fallbackCardImg"
              titleCssClass="compactBlogPostCard"
              subtitleCssClass="text-caption"
              :height="isLargeScreen ? '100' : '75'"
              @clicked="catchPostClick(post.postFile)"
            />
          </v-col>
        </v-row>
      </template>

      <!-- <template v-slot:news v-if="hasActiveNews">
        <TitleCard
          :title="welcomeInfo.newsTitle"
          cardClass="pa-2"
          titleClass="titleCardClass"
        />

        <div
          v-for="(entry, index) in newsEntries"
          :key="index"
          class="pt-4 px-1"
        >
          <SloganCard
            :slogan="entry.title"
            :subSlogan="entry.text"
            :sloganImg="entry.image"
          />
        </div>

        <div v-if="showWinterHolidayWishs" class="pt-4 px-1">
          <SloganCard
            slogan="Happy Holidays!"
            :sloganImg="winterHolidayImage"
            :subSlogan="decemberWishes"
          />
        </div>

        <div v-if="showNewYearWishs" class="pt-4 px-1">
          <SloganCard
            slogan="Happy New Year!"
            :sloganImg="newYearImage"
            :subSlogan="newYearWishes"
          />
        </div>
      </template> -->
    </LandingPageLayout>
  </v-container>
</template>

<script>
/**
 * The landing page of EnviDat is the root page ("./") first page shown
 * It consists of:
 * - TheTitleScreenLayout
 * - SearchBarView
 * - and show a list of category cards (baseClickCard)
 *
 * @summary landing page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2021-01-06 21:12:38
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { importStoreModule } from '@/factories/enhancementsFactory';
// import { gsap } from 'gsap';
import { getMonth } from 'date-fns';
import { mapGetters, mapState } from 'vuex';
import { eventBus, SHOW_REDIRECT_SIGNIN_DIALOG } from '@/factories/eventBus';

import MetadataCardPlaceholder from '@/components/Cards/MetadataCardPlaceholder.vue';
import InfoCards from '@/components/Cards/InfoCards.vue';

import BlogPostCard from '@/modules/blog/components/BlogPostCard.vue';
import LandingPageLayout from '@/modules/home/components/LandingPageLayout.vue';
import SearchBarView from '@/modules/home/components/SearchBarView.vue';
import SloganCard from '@/modules/home/components/SloganCard.vue';
import TeamPostCard from '@/modules/home/components/TeamPostCard.vue';

import {
  BLOG_NAMESPACE,
  GET_BLOG_LIST,
} from '@/modules/blog/store/blogMutationsConsts';
import {
  ABOUT_PATH,
  BLOG_PAGENAME,
  BROWSE_PATH,
  LANDING_PAGENAME,
  METADATADETAIL_PAGENAME,
  USER_SIGNIN_PATH,
} from '@/router/routeConsts';
import { SET_CURRENT_PAGE } from '@/store/mainMutationsConsts';
import {
  METADATA_NAMESPACE,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';

import smLogo from '@/assets/logo/EnviDat_logo_64.png';
import mdLogo from '@/assets/logo/EnviDat_logo_128.png';

import store from '@/store/store';
import BaseCategoryCard from '@/components/BaseElements/BaseCategoryCard.vue';

import MetadataCardLandingPage from '@/components/Cards/MetadataCardLandingPage.vue';

// Import useDisplay composable from Vuetify 3
import { useDisplay } from 'vuetify';

export default {
  name: 'LandingPage',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // console.log("landing beforeRouteEnter to: " + to + " from: " + from + " next: " + next);
      vm.$store.commit(SET_CURRENT_PAGE, LANDING_PAGENAME);
      // const bgimg = vm.isSmallScreen ? vm.MobileBGImage : vm.PageBGImage;
      // vm.$store.commit(SET_APP_BACKGROUND, bgimg);
    });
  },
  beforeCreate() {
    const importFun = () => import('@/modules/blog/store/blogStore');
    importStoreModule(store, 'blog', importFun).then(() => {
      this.$store.dispatch(`${BLOG_NAMESPACE}/${GET_BLOG_LIST}`);
    });
  },
  created() {
    this.blogModuleLoaded = !!this.$store?.state?.blog;

    this.$store?.watch(
      state => state.blog,
      value => {
        this.blogModuleLoaded = !!value;
      },
    );

    console.log('Vuetify Object in Created:', this.$vuetify);
  },
  mounted() {
    window.scrollTo(0, 0);

    this.initPolygonParticles();
    // this.initAnimation();
  },
  beforeUnmount() { // Changed from 'destroyed' to 'beforeUnmount' for Vue 3
    this.stopParticles();
  },
  setup() {
    const display = useDisplay();

    return {
      display,
    };
  },
  computed: {
    ...mapState(['categoryCards', 'config', 'loadingConfig']),
    ...mapGetters(METADATA_NAMESPACE, [
      'loadingMetadatasContent',
      'metadatasContentSize',
      'recentMetadata',
    ]),
    ...mapState(BLOG_NAMESPACE, ['list']),

    // Breakpoint-based computed properties
    isLargeScreen() {
      return this.display.large; // lgAndUp equivalent
    },
    isMediumScreenAndDown() {
      return  this.display.sm.value || this.display.xs.value;
    },
    isMediumScreenAndUp() {
      return this.display.md.value || this.display.lg.value || this.display.xl.value;
    },

    blogPosts() {
      if (this.blogModuleLoaded) {
        if (this.list?.length > 0) {
          return this.list.slice(0, 3);
        }
      }

      return [];
    },
    welcomeInfo() {
      return this.config?.welcomeInfo || this.defaultWelcomeInfo;
    },
    datasetsTotal() {
      return this.loadingMetadatasContent ? 0 : this.metadatasContentSize;
    },
    hasActiveNews() {
      return (
        (this.config?.newsConfig?.newsActive && this.newsEntries.length > 0) ||
        this.showNewYearWishs ||
        this.showWinterHolidayWishs
      );
    },
    newsEntries() {
      return this.config?.newsConfig?.entries || [];
    },
    showPolygonParticles() {
      return (
        this.isLargeScreen &&
        this.effectsConfig.landingPageParticles &&
        !this.showDecemberParticles
      );
    },
    maintenanceConfig() {
      return this.config?.maintenanceConfig || {};
    },
    signinRedirectActive() {
      return this.maintenanceConfig?.signinRedirectActive || false;
    },
    showDecemberParticles() {
      return this.effectsConfig.decemberParticles && this.itIsDecember;
    },
    itIsDecember() {
      return getMonth(Date.now()) === 11;
    },
    showNewYearWishs() {
      return this.effectsConfig.showNewYearWishes && getMonth(Date.now()) === 0;
    },
    showWinterHolidayWishs() {
      return this.effectsConfig.showDecemberWishes && this.itIsDecember;
    },
    decemberWishes() {
      return this.effectsConfig.decemberWishes;
    },
    winterHolidayImage() {
      return this.mixinMethods_getWebpImage(
        'cards/slogan/holidays_winter',
        this.$store.state,
      );
    },
    newYearWishes() {
      return this.effectsConfig.newYearWishes || '';
    },
    newYearImage() {
      return this.mixinMethods_getWebpImage(
        'cards/slogan/new_year',
        this.$store.state,
      );
    },
    effectsConfig() {
      return this.config?.effectsConfig || {};
    },
    sloganButtonText() {
      /*
      if (this.isLargeScreen) {
        return 'EXPLORE';
      }
      */

      return 'EXPLORE DATA';
    },
    sloganMoreButtonText() {
      if (this.isLargeScreen) {
        return 'ABOUT ENVIDAT';
      }

      return 'ABOUT';
    },
  },
  watch: {
    config() {
      if (!this.loadingConfig) {
        this.initPolygonParticles();
      }
    },
  },
  methods: {
    // initAnimation() {
    //   gsap.set('.bgcCard', (index, element) => {
    //     const currentBgColor = window.getComputedStyle(element).backgroundColor;

    //     // Estrae i valori RGB del colore attuale
    //     const rgbValues = currentBgColor.match(/\d+/g);
    //     const rgbaTransparent = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0)`;

    //     // Imposta il colore della card come il suo RGB con opacità 0
    //     gsap.set(element, {
    //       backgroundColor: rgbaTransparent,
    //     });
    //   });
    //   gsap.fromTo(
    //     '#LandingPage',
    //     { scale: 1.3, opacity: 0 },
    //     {
    //       opacity: 1,
    //       scale: 1,
    //       duration: 0.5,
    //       // onComplete: () => {
    //       //   const cards = document.querySelectorAll('.bgcCard');

    //       //   cards.forEach(card => {
    //       //     card.classList.remove('bgcCard');

    //       //   cards.forEach(card => {
    //       //     const currentBgColor = window.getComputedStyle(card).backgroundColor;

    //       //     const rgbValues = currentBgColor.match(/\d+/g);

    //       //     const rgbaTransparent = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0)`;

    //       //     const rgbaOpaque = `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, 0.5)`;

    //       //     card.style.backgroundColor = rgbaTransparent;

    //       //     gsap.to(card, {
    //       //       duration: 0.5,
    //       //       backgroundColor: rgbaOpaque,
    //       //       delay: 0.5,
    //       //     });
    //       //   });

    //       // },
    //     },
    //   );
    // },
    stopParticles(fullClean = true) {
      try {
        if (this.currentParticles) {
          this.currentParticles.particles.move.enable = false;
          this.currentParticles.particles.opacity.anim.enable = false;
          this.currentParticles.particles.size.anim.enable = false;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error during particle stop: ${error}`);
      } finally {
        this.currentParticles = null;
        if (fullClean) {
          window.pJS = null;
        }
      }
    },
    initPolygonParticles() {
      if (this.showPolygonParticles) {
        // particleOptions have to be in the folder public/particles/polygonParticleOptions.json for development
        // in production they have to be in same folder as the index.html there -> ./particles/polygonParticleOptions.json
        // eslint-disable-next-line no-undef
        particlesJS.load(
          'polygon-canvas',
          './particles/polygonParticleOptions.json',
          () => {
            // console.log('polygon-canvas - particles.js config loaded');
            if (this.currentParticles) {
              this.stopParticles(false);
            }
            this.currentParticles = window.pJS;
          },
        );

        // eslint-disable-next-line no-undef
        /*
        particlesJS.load(
          'polygon-canvas2',
          './particles/polygonParticleOptions2.json',
          () => {
            // console.log('polygon-canvas - particles.js config loaded');
            if (this.currentParticles) {
              this.stopParticles(false);
            }
            this.currentParticles = window.pJS;
          },
        );
        */
      }
    },
    catchCategoryClicked(cardType) {
      if (cardType.includes('login')) {
        this.catchSigninClick();
        return;
      }

      if (cardType.includes('mode')) {
        const splits = cardType.split('_');
        const modeName = splits[1];
        this.catchModeClicked(modeName);
        return;
      }

      const newTags = [cardType];
      const stringTags = this.mixinMethods_convertArrayToUrlString(newTags);

      this.mixinMethods_additiveChangeRoute(BROWSE_PATH, '', stringTags);
    },
    catchModeClicked(mode) {
      this.$router.push({
        path: BROWSE_PATH,
        query: { mode },
      });
    },
    catchSearchClicked(search) {
      this.$router.push({
        path: BROWSE_PATH,
        query: { search },
      });
    },
    catchActionsButton(event, search) {
      if (event === 'search') {
        this.$router.push({
          path: BROWSE_PATH,
          query: { search },
        });
      } else {
        this.$router.push({ path: BROWSE_PATH });
      }
    },
    catchMoreClicked() {
      this.$router.push({ path: ABOUT_PATH });
    },
    catchSigninClick() {
      if (this.signinRedirectActive) {
        // don't pass any parameters to show the default message for Sign In redirect
        eventBus.emit(SHOW_REDIRECT_SIGNIN_DIALOG);
        return;
      }

      if (this.$route.path === USER_SIGNIN_PATH) {
        return;
      }

      this.$router.push({ path: USER_SIGNIN_PATH, query: '' });
    },
    redirectToDashboard() {
      window.open('https://www.envidat.ch/user/reset', '_blank');
    },
    catchMetadataClicked(datasetname) {
      this.$store.commit(
        `${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`,
        this.$route,
      );

      this.$router.push({
        name: METADATADETAIL_PAGENAME,
        params: {
          metadataid: datasetname,
        },
      });
    },
    catchPostClick(post) {
      if (this.$route.params?.post !== post) {
        this.$router.push({
          name: BLOG_PAGENAME,
          params: { post },
        });
      }
    },
    // Add your mixin methods or import them appropriately
    mixinMethods_getWebpImage(path, state) {
      // Your implementation here
      return ''; // Placeholder
    },
    mixinMethods_convertArrayToUrlString(array) {
      // Your implementation here
      return array.join(',');
    },
    mixinMethods_additiveChangeRoute(path, query, tags) {
      // Your implementation here
      this.$router.push({
        path,
        query: { ...query, tags },
      });
    },
  },
  components: {
    LandingPageLayout,
    // TheTitleScreenLayout,
    SearchBarView,
    BaseCategoryCard,
    SloganCard,
    // CategoryCard,
    MetadataCardLandingPage,
    MetadataCardPlaceholder,
    // TitleCard,
    BlogPostCard,
    TeamPostCard,
    InfoCards,
  },
  data: () => ({
    buttonsActions: [
      {
        text: 'Search',
        class: 'primary',
        action: 'search',
      },
      {
        text: 'Explore all',
        class: 'primary',
        outlined: true,
        action: 'explore',
      },
    ],
    blogModuleLoaded: false,
    // PageBGImage: 'app_b_landingpage',
    // MobileBGImage: 'app_b_browsepage',
    defaultWelcomeInfo: {
      titleText: 'EnviDat',
      Slogan: 'Environmental Research Data at your Fingertips',
      SubSlogan:
        'EnviDat provides research data from Switzerland and all over the world. The data is being provided by researchers of the many research units of the Swiss Federal Institute for Forest, Snow and Landscape WSL.',
      searchLabelText:
        'Looking for something specific? Enter research term, topic or author here!',
      smallSearchLabelText: 'Enter research term, topic or author',
      searchText: 'Looking for something specific?',
      categoryText:
        'Have a look at one of theses categories or sign in to upload your data',
      articlesTitle: 'Recent EnviDat Blog Articles',
      newsTitle: 'News From The EnviDat Team',
      infoTitle: 'How it works?',
      categoriesTitle: 'Research Data Categories',
      datasetsTitle: 'Recently Published Research Datasets',
    },
    infoCards: [
      {
        title: 'Create your dataset',
        subtitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id felis eget magna tincidunt viverra. Integer posuere volutpat lectus, sit amet convallis tortor condimentum in. Fusce aliquam, lectus non cursus elementum, elit nunc consequat lacus, a aliquet neque ipsum et turpis. Phasellus scelerisque velit et sapien placerat, quis ornare lorem convallis. Donec at justo sed est interdum accumsan sed ut risus. Nulla facilisi. Mauris condimentum felis sit amet tortor dignissim, non vestibulum turpis pretium.',
        points: [
          'Lorem ipsum dolor sit amet',
          'Lorem ipsum dolor sit amet',
          'Lorem ipsum dolor sit amet',
        ],
        action: '/',
        actionTitle: 'Create Dataset',
        image: '../../assets/icon-get.png',
      },
      {
        title: 'Validated by official institutions',
        subtitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id felis eget magna tincidunt viverra. Integer posuere volutpat lectus, sit amet convallis tortor condimentum in. Fusce aliquam, lectus non cursus elementum, elit nunc consequat lacus, a aliquet neque ipsum et turpis. Phasellus scelerisque velit et sapien placerat, quis ornare lorem convallis. Donec at justo sed est interdum accumsan sed ut risus. Nulla facilisi. Mauris condimentum felis sit amet tortor dignissim, non vestibulum turpis pretium.',
        points: [
          'Lorem ipsum dolor sit amet',
          'Lorem ipsum dolor sit amet',
          'Lorem ipsum dolor sit amet',
        ],
        action: '/',
        actionTitle: 'View More',
        image: '../../assets/icon-get.png',
      },
      {
        title: 'Connect to the world',
        subtitle:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id felis eget magna tincidunt viverra. Integer posuere volutpat lectus, sit amet convallis tortor condimentum in. Fusce aliquam, lectus non cursus elementum, elit nunc consequat lacus, a aliquet neque ipsum et turpis. Phasellus scelerisque velit et sapien placerat, quis ornare lorem convallis. Donec at justo sed est interdum accumsan sed ut risus. Nulla facilisi. Mauris condimentum felis sit amet tortor dignissim, non vestibulum turpis pretium.',
        points: [
          'Lorem ipsum dolor sit amet',
          'Lorem ipsum dolor sit amet',
          'Lorem ipsum dolor sit amet',
        ],
        action: '/',
        actionTitle: 'Browse all dataset',
        image: '../../assets/icon-get.png',
      },
    ],
    fileIconString: '',
    alternativeText: 'EnviDat logo',
    fallbackCardImg: null,
    smLogo,
    mdLogo,
  }),
};
</script>

<style scoped></style>

<style>
.compactBlogPostCard {
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1rem;
}
.background-grey {
  background-color: rgba(245, 245, 245, 0.75);
}
</style>
